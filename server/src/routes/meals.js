import { version } from "../../package.json";
import { Router } from "express";
const bodyParser = require('body-parser');
const router = Router();

var Meal = require('../models/models').Meal;
var Request = require('../models/models').Request;
var User = require('../models/models').User;
var Available = require('../models/models').Available;
var Mealreview = require('../models/models').Mealreview;
var Notification = require('../models/models').Notification;

router.get('/listings', (req, res) => {
  Meal.find({archived: false})
      .then(meals => {console.log('meals', meals); res.json(meals)})
})

router.get('/:id', (req, res) => {
  console.log('fetching');
  Meal.findById(req.params.id)
      .populate('chef')
      .populate('availability')
      .populate({ path: 'reviews', populate: { path: 'author'}})
      .exec()
      .then(meal => res.json(meal))
      .catch(err => console.error('get error', err))
})

router.get('/:id/available', (req, res) => {
  Available.find({ 'meal': req.params.id, 'passed': false })
           .then(available => {console.log(available); res.json(available)})
})

router.get('/:id/review', (req, res) => {
  console.log('looking for request');
  Request.find({ consumer: req.query.user, meal: req.params.id, payment: true, expired: true })
         .then(request => {
           console.log('!!! REQUEST !!!', request);
           res.json(request)
         });
})

router.post('/:id/save', (req, res) => {
  console.log('saving meal');

  const changes = {
    title: req.body.title,
    description: req.body.description,
    ingredients: req.body.ingredients,
    price: req.body.price,
    cuisine: req.body.cuisine
  }

  Meal.findByIdAndUpdate(req.params.id, changes, {new: true})
      .populate('chef')
      .exec()
      .then(meal => {
        console.log('!!!!!updated meal!!!!', meal);
        res.json(meal);
      })
      .catch(err => console.error('error here', err))
})

router.post('/:id/request', (req, res) => {
  console.log('requesting meal', req.params.id);
  var newRequest = new Request({
    consumer: req.body.consumer,
    chef: req.body.chef,
    meal: req.body.meal,
    requests: req.body.requests,
    time: req.body.time,
    accepted: false
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
      meal.save();
    })

    Available.findById(req.body.time._id).then(available => {
      const orders = available.orders.slice();
      orders.push(saved._id);
      available.orders = orders;
      available.save();
    })

    const newNotif = new Notification({
      type: 'New Request',
      meal: saved._id,
      content: `New request for ${mealTitle}.`,
      user: saved.chef,
      seen: false
    })

    await newNotif.save()
  }).then(e => res.send('requested'))
  console.log('meal requested');
})

router.post('/:id/archive', (req, res) => {
  Meal.findByIdAndUpdate(req.params.id, {archived: true}, {new: true})
      .then(archived => {
        const newNotif = new Notification({
          type: 'Archived Meal',
          meal: req.params.id,
          content: `You have recently archived ${archived.title}.`,
          user: archived.chef,
          seen: false
        })

        newNotif.save()

        res.json(archived);
      })
})

router.post('/:id/setavailable', async (req, res) => {
  // console.log('times', req.body.times)
  const availability = await Promise.all(req.body.times.map(async item => {
    const date= new Date(item.date);
    const start = item.start.split(':');
    const timeLong = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
                     parseInt(start[0]), parseInt(start[1]), 0, 0 ).getTime()
    // console.log('itemid', item._id);
    let final = {};
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
      // console.log('new item')
      const tempAvailable = new Available({
        meal: req.params.id,
        chef: req.body.chefId,
        date: item.date,
        start: item.start,
        end: item.end,
        time: timeLong
      })

      await tempAvailable.save().then(available => {final = available});
    }
    // console.log('final', final)
    return final
  }))

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
            seen: false
          })

          newNotif.save()

        })
    res.json(review);
  });
})

router.delete('/:id/setavailable', (req, res) => {
  Available.findByIdAndDelete(req.body.availableId)
           .then(e =>{console.log('deleted'); res.send('deleted')})

  Meal.findById(req.params.id)
      .then(meal => {
        const temp = meal.availability;
        temp.filter(item => item._id!==req.body.availableId);
        meal.availability = temp;
        meal.save()
      })
})

export default router;
