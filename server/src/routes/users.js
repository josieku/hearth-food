import { version } from "../../package.json";
import { Router } from "express";
const bodyParser = require('body-parser');
const router = Router();

var User = require('../models/models').User;
var Meal = require('../models/models').Meal;
var Request = require('../models/models').Request;

router.get('/:id', (req, res) => {
  User.findById(req.params.id)
      .populate('orders')
      .exec()
      .then(user => {console.log(user); res.json(user)})
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
  Request.find({ 'consumer': req.params.id })
         .then(requests => {
           const end = requests.length;
           const list = requests.slice(end-3);
           res.json(list);
         })
})

export default router;
