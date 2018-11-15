var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect)

module.exports = mongoose.Schema({
  meal: {
    type: mongoose.Schema.ObjectId,
    ref: 'Meal'
  },
  body: {
    type: String,
    required: true
  },
  anonymous:{
    type: Boolean,
    required: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true
  },
  rating:{
    type: Number,
    required: true,
  }
});