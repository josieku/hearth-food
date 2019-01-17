import { version } from "../../package.json";
import { Router } from "express";
import cron from 'node-cron';

const router = Router();

var Meal = require('../models').Meal;
var Request = require('../models').Request;
var User = require('../models').User;
var Available = require('../models').Available;
var Mealreview = require('../models').Mealreview;
var Notification = require('../models').Notification;

/* ROUTES */

router.get('/listings', (req, res) => {
  Meal.find({archived: false})
      .populate('availability')
      .populate('chef')
      .exec()
      .then(meals => {
        // console.log('meals', meals);
        res.json(meals)})
})

router.get('/:id', (req, res) => {
  Meal.findById(req.params.id)
      // .populate('chef')
      .populate('availability')
      .populate({ path: 'reviews', populate: { path: 'author'}})
      .exec()
      .then(meal => res.json(meal))
      .catch(err => console.error('get error', err))
})

router.get('/:id/available', (req, res) => {
  Available.find({ 'meal': req.params.id, 'passed': false })
           .then(available => {
             // console.log(available);
             res.json(available)})
})

router.get('/:id/review', (req, res) => {
  Request.find({ consumer: req.query.user, meal: req.params.id,
                 expired: true, review: false })
         .then(request => {
           res.json(request)
         });
})

router.post('/:id/save', (req, res) => {
  // console.log('saving meal');

  const changes = {
    title: req.body.title,
    description: req.body.description,
    ingredients: req.body.ingredients,
    price: req.body.price,
    cuisine: req.body.cuisine,
    picture: req.body.picture
  }

  Meal.findByIdAndUpdate(req.params.id, changes, {new: true})
      .populate('chef')
      .exec()
      .then(meal => {
        // console.log('!!!!!updated meal!!!!', meal);
        res.json(meal);
      })
      .catch(err => console.error('error here', err))
})

router.post('/:id/request', (req, res) => {
  // console.log('requesting meal', req.params.id);
  var newRequest = new Request({
    consumer: req.body.consumer,
    chef: req.body.chef,
    meal: req.body.meal,
    requests: req.body.requests,
    time: req.body.time,
    accepted: false,
  })

  newRequest.save().then(async saved => {
    let mealTitle;
    User.findById(req.body.consumer).then(consumer => {
      const tempOrders = consumer.orders.slice();
      tempOrders.push(saved._id);
      consumer.orders = tempOrders;
      consumer.save();
    })

    User.findById(req.body.chef).then(chef => {
      const tempRequests = chef.requests.slice();
      tempRequests.push(saved._id);
      chef.requests = tempRequests;
      chef.save();
    })

    await Meal.findById(req.body.meal).then(meal => {
      mealTitle = meal.title;
      const tempOrders = meal.orders.slice();
      tempOrders.push(saved._id);
      meal.orders = tempOrders;
      meal.save()
    })

    Available.findById(req.body.time._id).then(available => {
      const orders = available.orders.slice();
      orders.push(saved._id);
      available.orders = orders;
      available.save();
    })

    let chefStr = `New request for ${mealTitle} on `
    chefStr += `${new Date(req.body.time.date).toDateString()} at ${req.body.time.start}.`

    const chefNotif = new Notification({
      type: 'New Request',
      meal: req.body.meal,
      content: chefStr,
      user: req.body.chef,
      seen: false,
      time: Date.now(),
    })

    chefNotif.save()

    let conStr = `New request for ${mealTitle} made for `
    conStr += `${new Date(req.body.time.date).toDateString()} at ${req.body.time.start}.`

    const consumerNotif = new Notification({
      type: 'New Request',
      meal: req.body.meal,
      request: saved._id,
      content: conStr,
      user: req.body.consumer,
      seen: false,
      time: Date.now(),
    })

    consumerNotif.save()

  }).then(e => res.send('requested'))
  // console.log('meal requested');
})

router.post('/:id/archive', (req, res) => {
  Meal.findByIdAndUpdate(req.params.id, {archived: true}, {new: true})
      .then(archived => {
        const newNotif = new Notification({
          type: 'Archived Meal',
          meal: req.params.id,
          content: `You have recently archived ${archived.title}.`,
          user: archived.chef,
          seen: false,
          time: Date.now()
        })

        newNotif.save()

        res.json(archived);
      })
})

router.post('/:id/setavailable', async (req, res) => {
  const availability = await Promise.all(req.body.times.map(async item => {
    const date= new Date(item.date);
    const start = item.start.split(':');
    const hour = parseInt(start[0])-1 >= 0 ? parseInt(start[0]) - 1 : 23
    const dateFull = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
                     hour, parseInt(start[1]), 0, 0 )
    const timeLong = dateFull.getTime();

    let final = {};

    // update if changes were made to an existing available object
    // create a new object if not
    if (item._id || item.availableId){
      const id = item._id || item.availableId;
      const updates = {
        date: item.date,
        start: item.start,
        end: item.end,
        time: timeLong
      }
      await Available.findByIdAndUpdate(id, updates, {new: true})
               .then(available => {final = available});
    } else {
      const tempAvailable = new Available({
        meal: req.params.id,
        chef: req.body.chefId,
        date: item.date,
        start: item.start,
        end: item.end,
        time: timeLong,
      })

      await tempAvailable.save().then(available => {final = available});
    }

    // use cron to schedule expiry of time availabilities
    let cronStr = `0 ${dateFull.getMinutes()} ${dateFull.getHours()} `
    cronStr += `${date.getDate()} ${date.getMonth()+1} ${date.getDay()}`

    var job = cron.schedule(cronStr, function(){
      Available.findByIdAndUpdate(final._id, {passed: true})
               .then(e => console.log('passed'))
      job.destroy();
    }, true)

    return final
  }))

  // update availability on meal
  await Meal.findByIdAndUpdate(req.params.id, { availability }, {new: true})
      .populate('availability')
      .exec()
      .then(meal => {res.json(meal.availability.filter(item=>item.time > Date.now()))});

})

router.post('/:id/review', (req, res) => {
  const newReview = new Mealreview({
    meal: req.params.id,
    body: req.body.content,
    anonymous: req.body.anon,
    author: req.body.userId,
    date: req.body.date,
    rating: req.body.rating
  })

  newReview.save().then(review => {
    Meal.findById(req.params.id)
        .then(meal => {
          const reviews = meal.reviews ? meal.reviews.slice() : [];
          const reviewLength = reviews.length;
          const overallRating = ((meal.overallRating * reviewLength) + review.rating)/(reviewLength+1);

          reviews.push(review._id);
          meal.reviews = reviews;
          meal.overallRating = overallRating;
          meal.save();

          const newNotif = new Notification({
            type: 'New Review',
            meal: req.params.id,
            content: `You wrote a review for ${meal.title}.`,
            user: req.body.userId,
            seen: false,
            time: Date.now()
          })

          newNotif.save()
        })

    Request.findByIdAndUpdate(req.body.requestId, {review: true})
           .then(req=> console.log('reviewed for this request'))
    res.json(review);
  });
})

router.delete('/:id/setavailable', (req, res) => {
  Available.findByIdAndUpdate(req.body.availableId, {passed: true})
           .then(e => res.send('deleted'))

  Meal.findById(req.params.id)
      .then(meal => {
        const temp = meal.availability;
        temp.filter(item => item._id!==req.body.availableId);
        meal.availability = temp;
        meal.save()
      })
})

export default router;
