import { version } from "../../package.json";
import { Router } from "express";
const bodyParser = require('body-parser');
const router = Router();

var Meal = require('../models/models').Meal;
var Request = require('../models/models').Request;
var User = require('../models/models').User;
var Available = require('../models/models').Available;

router.get('/listings', (req, res) => {
  Meal.find({archived: false})
      .then(meals => {console.log('meals', meals); res.json(meals)})
})

router.get('/:id', (req, res) => {
  console.log('fetching');
  Meal.findById(req.params.id)
      .populate('chef')
      // .populate('availability')
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
  }).then(e => res.send('requested'))
  console.log('meal requested');
})

router.post('/:id/archive', (req, res) => {
  Meal.findByIdAndUpdate(req.params.id, {archived: true}, {new: true})
      .then(archived => res.json(archived))
})

router.post('/:id/setavailable', (req, res) => {
  if (req.body.availableId){
    const updates = {
      date: req.body.date,
      start: req.body.start,
      end: req.body.end
    }
    Available.findByIdAndUpdate(req.body.availableId, updates)
             .then(available => res.json(available));

  } else{
    const tempAvailable = new Available({
      meal: req.body.mealId,
      chef: req.body.chefId,
      date: req.body.date,
      start: req.body.start,
      end: req.body.end,
    })

    tempAvailable.save().then(available => {
      Meal.findByIdAndUpdate(req.body.mealId)
          .then(meal => {
            const availability = meal.availability.slice();
            availability.push(available._id);

            meal.availability = availability;
            meal.save().then(e => res.json(available));
          })
    })
  }
})

export default router;
