import { version } from "../../package.json";
import { Router } from "express";
const bodyParser = require('body-parser');
const router = Router();

var Meal = require('../models/models').Meal;
var Request = require('../models/models').Request;
var User = require('../models/models').User;
var Available = require('../models/models').Available;
var Mealreview = require('../models/models').Mealreview;

router.get('/listings', (req, res) => {
  Meal.find({archived: false})
      .then(meals => {console.log('meals', meals); res.json(meals)})
})

router.get('/:id', (req, res) => {
  console.log('fetching');
  Meal.findById(req.params.id)
      .populate('chef')
      .populate('availability')
      // .populate('reviews')
      .exec()
      .then(meal => {console.log(meal); res.json(meal)})
      .catch(err => console.error(err))
})

router.get('/:id/available', (req, res) => {
  console.log('fetching available');
  Available.find({ 'meal': req.params.id, 'passed': false })
           .then(available => {console.log(available); res.json(available)})
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
      .then(meal => {console.log('!!!!!updated meal!!!!', meal); res.json(meal)})
      .catch(err => console.error(err))
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

  newRequest.save().then(saved => {
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

    Meal.findById(req.body.meal).then(meal => {
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

  }).then(e => res.send('requested'))
  console.log('meal requested');
})

router.post('/:id/archive', (req, res) => {
  Meal.findByIdAndUpdate(req.params.id, {archived: true}, {new: true})
      .then(archived => res.json(archived))
})

router.post('/:id/setavailable', async (req, res) => {
  console.log('times', req.body.times)
  const availability = await Promise.all(req.body.times.map(async item => {
    const date= new Date(item.date);
    const start = item.start.split(':');
    const timeLong = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
                     parseInt(start[0]), parseInt(start[1]), 0, 0 ).getTime()
    console.log('itemid', item._id);
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
      console.log('new item')
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
    console.log('final', final)
    return final
  }))

  await Meal.findByIdAndUpdate(req.params.id, { availability }, {new: true})
      .populate('availability')
      .exec()
      .then(meal => {res.json(meal.availability.filter(item=>item.time > Date.now()))});

})

router.post('/:id/review', (req, res) => {

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
