import { version } from "../../package.json";
import { Router } from "express";
const bodyParser = require('body-parser');
const router = Router();

var User = require('../models/models').User;
var Meal = require('../models/models').Meal;

router.get('/:id', (req, res) => {
  User.findOne({role:'chef', _id: req.params.id })
      .then(user => {console.log(user); res.json(user)})
      .catch(err => console.error(err))
})

router.post('/:id/add', async (req,res) => {
  var newMeal = new Meal({
    title: req.body.title,
    ingredients: req.body.ingredients,
    description: req.body.description,
    price: req.body.price,
    location: "somewhere",
    status: "pending",
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

export default router;
