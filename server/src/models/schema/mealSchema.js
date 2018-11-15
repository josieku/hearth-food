var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect)

module.exports = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  chef: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  cuisine: {
    type: [],
    required: true
  },
  // meat: {
  //   type: String,
  //   enum: [],
  //   required: true
  // },
  description: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },
  availability:{
    type: [
      {
        ref: 'Available',
        type: mongoose.Schema.ObjectId
      }
    ]
  },
  price: {
    type: Number,
    required: true
  },
  picture: {
    type: String
  },
  status:{
    type: String,
    default: "pending"
  },
  reviews: {
    type: [
      {
        ref: 'Mealreview',
        type: mongoose.Schema.ObjectId
      }
    ]
  },
  overallRating:{
    type: Number,
    default: 0,
  },
  orders: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Request'
      }
    ]
  },
  archived: {
    type: Boolean,
    required: true,
    default: false
  },
  recipe: {
    type: String,
    // required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  }
});