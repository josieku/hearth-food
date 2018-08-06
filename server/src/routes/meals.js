import { version } from "../../package.json";
import { Router } from "express";
const bodyParser = require('body-parser');
const router = Router();

var Meal = require('../models/models').Meal;
var Request = require('../models/models').Request;
var User = require('../models/models').User;

router.get('/listings', (req, res) => {
  Meal.find({archived: false})
      .then(meals => {console.log('meals', meals); res.json(meals)})
})

router.get('/:id', (req, res) => {
  console.log('fetching');
  Meal.findById(req.params.id)
      .populate('chef')
      // .populate('reviews')
      .exec()
      .then(meal => {console.log(meal); res.json(meal)})
      .catch(err => console.error(err))
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
  })
  console.log('meal requested');
})

router.post('/:id/archive', (req, res) => {
  Meal.findByIdAndUpdate(req.params.id, {archived: true}, {new: true})
      .then(archived => res.json(archived))
})

export default router;
