var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect)

module.exports = mongoose.Schema({
  chef: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  consumer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  meal: {
    type: mongoose.Schema.ObjectId,
    ref: 'Meal'
  },
  requests: {
    type: String
  },
  time: {
    type: mongoose.Schema.ObjectId,
    ref: 'Available'
  },
  accepted: {
    type: Boolean,
    required: true,
    default: false
  },
  payment: {
    type: Boolean,
    required: true,
    default: false
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  expired: {
    type: Boolean,
    required: true,
    default: false
  },
  cancelled: {
    type: Boolean,
    default: false
  },
  changed: {
    type: Boolean,
    default: false
  },
  changes: {
    type: [],
  },
  delivery: {
    type: Boolean,
    default: false,
  },
  review: {
    type: Boolean,
    default: false,
  },
  declineComment: {
    type: String,
  }
});