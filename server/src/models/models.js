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

var mealSchema = mongoose.Schema({
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

var requestsSchema = mongoose.Schema({
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
})

var availabilitySchema = mongoose.Schema({
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

// availabilitySchema.index({ 'expireAt': 1 }, { expireAfterSeconds: 0 })

var notificationSchema = mongoose.Schema({
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



var User = mongoose.model('User', userSchema);
var Meal = mongoose.model('Meal', mealSchema);
var Mealreview = mongoose.model('Mealreview', mealReviewSchema);
var Userreview = mongoose.model('Userreview', userReviewSchema);
var Request = mongoose.model('Request', requestsSchema);
var Available = mongoose.model('Available', availabilitySchema);
// var Allnotif = mongoose.model('Allnotifications', notifAllSchema);
var Notification = mongoose.model('Notification', notificationSchema);


module.exports = {
  User: User,
  Meal: Meal,
  Mealreview: Mealreview,
  Userreview: Userreview,
  Request: Request,
  Available: Available,
  Notification: Notification,
}
