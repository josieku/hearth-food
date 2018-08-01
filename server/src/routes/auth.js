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
  console.log('at signup')
  if (!validate(req.body))
    throw 'Passwords do not match!!'

  var user = new User({
    firstName: req.body.first,
    lastName: req.body.last,
    password: req.body.password,
    phone: req.body.phone,
    email: req.body.email,
  })
  user.save()
  .then(save =>res.json(save))
  .catch(err => console.log("Error!:"+ err))
})


router.post('/login', passport.authenticate('local'), function(req, res) {
  res.json({
    success:!!req.user,
    user: req.user,
  })
});

router.get('/ping',function(req,res){
  res.send({
  user:req.user
  })
})

return router;
}
