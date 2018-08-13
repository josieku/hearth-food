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
      .populate('menu')
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
         .populate({path:'meal', populate:{path:'availability'}})
         .populate('time')
         .exec()
         .then(orders => res.json(orders))
})

router.get('/:id/history', (req, res) => {
  Request.find({'chef': req.params.id, 'expired': 'true'})
         .populate('chef')
         .populate('consumer')
         .populate('meal')
         .populate('time')
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
           User.findOne({role:'chef', "_id": req.params.id })
               .then(user => {
                 // console.log(user);
                 var menuList = user.menu.slice();
                 console.log('!!menu!!', menuList)
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
        seen: false,
        time: Date.now()
      })

      newNotif.save()

      res.send('request approved');
    })
})

router.post('/:id/requests/complete', (req,res) => {
  Request.findByIdAndUpdate(req.body.requestId, { completed: true, expired: true })
         .then(request => {
           const newNotif = new Notification({
             type: 'Accepted Request',
             meal: request.meal._id,
             content: `Your ${request.meal.title} meal request has been approved.  Now proceed to payment!`,
             user: request.consumer,
             seen: false,
             time: Date.now()
           })

           newNotif.save()

           res.json(request)
         })
})

router.post('/:id/requests/edit', (req, res) => {
  const updates = {
    time: req.body.time
  }

  Request.findById(req.body.requestId)
         .populate('chef')
         .populate('consumer')
         .populate({path:'meal', populate:{path:'availability'}})
         .populate('time')
         .exec()
         .then(request => {
           let str = `The pick up time of your requested meal of ${request.meal.title}`
           str += ` has changed from ${new Date(request.time.date).toDateString()} at ${request.time.start}`
           str += ` to ${new Date(req.body.time.date).toDateString()} at ${req.body.time.start}.`

           const newNotif = new Notification({
             type: 'Changed Request',
             meal: request.meal._id,
             content: str,
             user: request.consumer._id,
             seen: false,
             time: Date.now(),
           })

           newNotif.save()

           const changes = request.changes ? request.changes.slice() : [];
           changes.push({
             old: request.time,
             new: req.body.time,
             date: Date.now()
           })
           request.changes = changes;
           request.time = req.body.time;
           request.save().then(req => res.json(req))

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
