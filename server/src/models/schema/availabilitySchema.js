var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect)

module.exports = mongoose.Schema({
  meal: {
    type: mongoose.Schema.ObjectId,
    ref: 'Meal',
    required: true
  },
  chef: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
    default: false
  },
  time: {
    type: Number,
    required: true,
    default: 0
  },
  orders: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Request'
      }
    ]
  },
  recurring: {
    type: Boolean,
    required: true,
    default: false
  },
  comment: {
    type: String,
  }
  // expireAt: {
  //   type: Date,
  //   required: true
  // }
})