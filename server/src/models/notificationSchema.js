var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect)

module.exports = mongoose.Schema({
  type: {
    type: String,
    enum: ['Accepted Request', 'Changed Request', 'Declined Request',
    'Delivered Request', 'Expired Request', 'New Request', 'Request Status', 'Changed Profile',
    'Archived Meal', 'New Review']
  },
  request: {
    type: mongoose.Schema.ObjectId,
    ref: 'Request'
  },
  meal: {
    type: mongoose.Schema.ObjectId,
    ref: 'Meal'
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  seen: {
    type: Boolean,
    required: true,
    default: false
  },
})