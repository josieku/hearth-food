import { version } from "../../package.json";
import { Router } from "express";
const bodyParser = require('body-parser');
const router = Router();

var User = require('../models/models').User;
var Meal = require('../models/models').Meal;
var Request = require('../models/models').Request;
var Notification = require('../models/models').Notification;

router.get('/:id', (req, res) => {
  User.findById(req.params.id)
      .populate('orders')
      .exec()
      .then(user => res.json(user))
      .catch(err => console.error(err))
})

router.get('/:id/orders', (req,res) => {
  Request.find({ 'consumer': req.params.id })
         .populate('chef')
         .populate('consumer')
         .populate('meal')
         .exec()
         .then(requests => res.json(requests))
})

router.get('/:id/recent', (req, res) => {
  console.log('recents')
  Request.find({ 'consumer': req.params.id })
         .populate('meal')
         .populate('time')
         .exec()
         .then(requests => {
           requests = requests.sort((a,b)=>a.time.time-b.time.time);
           const end = requests.length;
           if ((end - 3) < 0){
             console.log(requests);
             res.json(requests)
           } else{
             const list = requests.slice(end-3);
             console.log(list);
             res.json(list);
           }
         })
})

router.get('/:id/notif', (req, res) => {
  Notification.find({ user: req.params.id })
       .populate('meal')
       .exec()
       .then(notifications => {
         console.log('!!!notifications!!!', notifications)
         res.json(notifications)
       });
})

router.post('/:id/edit', (req, res) => {
  const updates = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
    picture: req.body.picture
  }

  User.findByIdAndUpdate(req.params.id, updates)
      .then(user => res.json(user))
})

router.post('/:id/notif/markallread', async (req, res) => {
  await Promise.all(req.body.unseen.map(item => {
    Notification.findByIdAndUpdate(item, { seen: true })
                .populate('meal')
                .then(notification => notification);
  }))

  console.log('done promise')

  Notification.find({ user: req.params.id })
              .then(notifications => res.json(notifications))

})

export default router;
