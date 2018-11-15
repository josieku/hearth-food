var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect)

module.exports = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  identification: {
    type: String
  },
  picture: {
    type: String,
    default: "https://img1.cookinglight.timeinc.net/sites/default/files/styles/4_3_horizontal_-_1200x900/public/image/2017/01/main/pristine-sunny-side-up-eggs.jpg?itok=4GSTJDNE"
  },
  location:{
    type: Object
  },
  preferences:{
    type: [],
    default: [],
    required: true
  },
  rating: {
    type: Number,
    default: 5
  },
  role:{
    type: String,
    required: true
  },
  orders: {
    type: [
      {
        ref: 'Meal',
        type: mongoose.Schema.ObjectId,
      }
    ]
  },
  menu: {
    type: [
      {
        ref: 'Meal',
        type: mongoose.Schema.ObjectId,
      }
    ]
  },
  requests: {
    type: [
      {
        ref: 'Request',
        type: mongoose.Schema.ObjectId
      }
    ]
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  chef: {
    type: Boolean,
    required: true,
    default: false
  }
})