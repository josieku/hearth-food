var mongoose = require('mongoose');

if (! process.env.MONGODB_URI){
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}

var connect = process.env.MONGODB_URI;
mongoose.connect(connect)

var userSchema = mongoose.Schema({
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
    type: String
  },
  preferrences:{
    type: []
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
  verified: {
    type: Boolean,
    required: true,
    default: false
  }
})

var mealSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  chef: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  cuisine: {
    type: [],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  reviews: {
    type: [
      {
        ref: 'Review',
        type: mongoose.Schema.ObjectId
      }
    ]
  },
  location: {
    type: String,
    required: true
  }
})

var mealReviewSchema = mongoose.Schema({
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
})

var userReviewSchema = mongoose.Schema({
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

var User = mongoose.model('User', userSchema);
var Meal = mongoose.model('Meal', mealSchema);
var Mealreview = mongoose.model('Mealreview', mealReviewSchema);
var Userreview = mongoose.model('Userreview', chefReviewSchema);

module.exports = {
  User: User,
  Meal: Meal,
  Mealreview: Mealreview,
  Userreview: Userreview
}