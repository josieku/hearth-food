var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect)

module.exports = mongoose.Schema({
  directed: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  body: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true
  }
})