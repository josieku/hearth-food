import { version } from "../../package.json";
import { Router } from "express";
const bodyParser = require('body-parser');
const router = Router();

var Meal = require('../models/models').Meal;
var Request = require('../models/models').Request;
var User = require('../models/models').User;

router.get('/listings', (req, res) => {
  Meal.find({})
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
  console.log(req.params.id);
  // Meal.find({"_id":{"$oid":req.params.id}}).then(meals => console.log("meals", meals));
  // Meal.findOne({"_id":{"$oid":req.params.id}}).then(meal => console.log("meal", meal));
  Meal.findByIdAndUpdate(req.params.id, {$set: req.body})
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
      consumer.orders = consumer.orders.slice().push(saved._id);
      consumer.save();
    })

    User.findById(req.body.chef).then(chef => {
      chef.requests = chef.requests.slice().push(saved._id);
      chef.save();
    })

    Meal.findById(req.body.meal).then(meal => {
      meal.orders = meal.orders.slice().push(saved._id);
      meal.save();
    })
  })
  console.log('meal requested');
})

export default router;
