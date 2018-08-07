const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('.././models/models').User
var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

export default function(passport) {

var validate = function(userObj){
  return (userObj.password === userObj.repeat)
}

//get req for sign up
router.get('/login', function(req,res){
  res.json({success: !!req.user})
})
//post req for signup
router.post('/signup', function(req,res) {
  //code to check validation!!
  if (!validate(req.body))
    throw 'Passwords do not match!!'

  var user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    phone: req.body.phone,
    email: req.body.email,
    role: 'consumer',
  })
  user.save()
  .then(save =>res.json(save))
  .catch(err => console.log("Error!:"+ err))
})


router.post('/login', passport.authenticate('local'), function(req, res) {

  if (req.user.role === "chef"){
    User.findById(req.user._id)
        .populate('menu')
        .populate('orders')
        // .populate('requests')
        // .populate({path:'requests', populate: "meal"})
        .exec()
        .then(user => res.json(user))
  } else if (req.user.role === "consumer") {
    User.findById(req.user._id).populate('orders').exec()
        .then(user => res.json(user))
  } else{
    res.json(req.user);
  }

});

router.get('/ping',function(req,res){
  if (req.user){
    res.status(200).send(req.user);
  } else{
    res.status(400).send(null);
  }
})

return router;
}
