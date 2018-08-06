import { version } from "../../package.json";
import { Router } from "express";
const bodyParser = require('body-parser');
const router = Router();

var User = require('../models/models').User;
var Meal = require('../models/models').Meal;
var Request = require('../models/models').Request;

router.get('/:id', (req, res) => {
  User.findOne({role:'chef', _id: req.params.id })
      .populate('requests')
      // .populate({path:'requests', populate: "meal"})
      // .populate({path:'requests', populate: "consumer"})
      .exec()
      .then(user => {console.log(user); res.json(user)})
      .catch(err => console.error(err))
})

router.get('/:id/requests', (req, res) => {
  Request.find({'chef': req.params.id, 'accepted': 'false'})
         .populate('chef')
         .populate('consumer')
         .populate('meal')
         .then(requests => {console.log(requests); res.json(requests)});
})

router.post('/:id/add', (req,res) => {
  console.log('adding')
  var newMeal = new Meal({
    title: req.body.title,
    ingredients: req.body.ingredients,
    description: req.body.description,
    price: req.body.price,
    location: "somewhere",
    status: "pending",
    cuisine: req.body.cuisine,
    chef: req.body.chef,
  })

  newMeal.save()
         .then(saved => {
           console.log(saved);
           User.findOne({role:'chef', _id: req.params.id })
               .then(user => {
                 console.log(user);
                 var menuList = user.menu.slice();
                 console.log(menuList)
                 menuList.push(saved._id);
                 user.menu = menuList;
                 user.save();
                 res.json(saved);
               })
               .catch(err => console.error(err))
         })
})

router.post('/:id/accept', (req, res) => {
  Request
    .findByIdAndUpdate(req.body.requestId, {accepted: true}, {new: true})
    .then(request => console.log('request approved'))
  // Request
  // .findByIdAndUpdate(req.body.requestId, {accepted: true}, {new: true})
  // .then(request => {
  //   User.findById(req.params.id).then(user => {
  //     const reqs = user.requests.slice();
  //     console.log('temp requests list', reqs)
  //     for (var ind in reqs){
  //       console.log(reqs[ind], request._id);
  //       console.log(typeof reqs[ind], typeof request._id);
  //       if ((reqs[ind]).toString() === (request._id).toString()){ console.log('same'); reqs.splice(ind, 1); console.log(reqs); break;}
  //     };
  //     user.requests = reqs;
  //
  //     const ords = user.requests.slice();
  //     ords.push(request._id);
  //     user.orders = ords;
  //
  //     user.save().then( () => {
  //       Request.find({'chef': req.params.id, 'accepted':'false'})
  //              .then(requests => res.json(requests));
  //     })
  //   })
  // });
})

router.post('/:id/orders', (req, res) => {
  Request.find({'chef': req.params.id, 'accepted': 'true'})
         .populate('chef')
         .populate('consumer')
         .populate('meal')
         .then(orders => {console.log('orders', orders); res.json(orders)})
})

router.post('/:id/complete', (req,res) => {
  Request.findByIdAndUpdate(req.body.requestId, { completed: true })
         .then(request => res.json(request))
})

export default router;