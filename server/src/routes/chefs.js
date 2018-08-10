import { version } from "../../package.json";
import { Router } from "express";
const bodyParser = require('body-parser');
const router = Router();

var User = require('../models/models').User;
var Meal = require('../models/models').Meal;
var Request = require('../models/models').Request;
var Notification = require('../models/models').Notification;

router.get('/:id', (req, res) => {
  User.findOne({role:'chef', _id: req.params.id })
      .populate('requests')
      .exec()
      .then(user => res.json(user))
      .catch(err => console.error(err))
})

router.get('/:id/requests', (req, res) => {
  Request.find({'chef': req.params.id, 'accepted': 'false'})
         .populate('chef')
         .populate('consumer')
         .populate('meal')
         .exec()
         .then(requests => res.json(requests));
})

router.get('/:id/orders', (req, res) => {
  Request.find({'chef': req.params.id, 'accepted': 'true', 'completed': 'false'})
         .populate('chef')
         .populate('consumer')
         .populate('meal')
         .exec()
         .then(orders => res.json(orders))
})

router.get('/:id/history', (req, res) => {
  Request.find({'chef': req.params.id, 'expired': 'true'})
         .populate('chef')
         .populate('consumer')
         .populate('meal')
         .exec()
         .then(history => res.json(history))
})

router.post('/:id/menu/add', (req,res) => {
  var newMeal = new Meal({
    title: req.body.title,
    ingredients: req.body.ingredients,
    description: req.body.description,
    price: req.body.price,
    location: "somewhere",
    status: "pending",
    cuisine: req.body.cuisine,
    chef: req.body.chef,
    picture: req.body.picture,
    availability: req.body.availability
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

router.post('/:id/requests/accept', (req, res) => {
  Request
    .findByIdAndUpdate(req.body.requestId, {accepted: true}, {new: true})
    .populate('meal')
    .exec()
    .then(request => {
      const newNotif = new Notification({
        type: 'Accepted Request',
        meal: request.meal._id,
        content: `Your ${request.meal.title} meal request has been approved.  Now proceed to payment!`,
        user: request.consumer,
        seen: false
      })

      newNotif.save()

      res.send('request approved');
    })
})

router.post('/:id/complete', (req,res) => {
  Request.findByIdAndUpdate(req.body.requestId, { completed: true, expired: true })
         .then(request => {
           const newNotif = new Notification({
             type: 'Accepted Request',
             meal: request.meal._id,
             content: `Your ${request.meal.title} meal request has been approved.  Now proceed to payment!`,
             user: request.consumer,
             seen: false
           })

           newNotif.save()

           res.json(request)
         })
})

// router.post('/:id/changeMode', (req,res) => {
//   User.findById(req.params.id)
//          .then(user => {
//            if (user.role === "chef"){
//              user.role = "consumer";
//            } else if (user.role === "consumer") {
//              user.role = "chef";
//            }
//            user.save().then(user => res.json(user))
//          })
// })

export default router;
