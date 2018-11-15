var mongoose = require('mongoose');
var userSchema = require('./schema/userSchema');
var mealSchema = require('./schema/mealSchema');
var mealReviewSchema = require('./schema/mealReviewSchema');
var userReviewSchema = require('./schema/userReviewSchema');
var requestsSchema = require('./schema/requestsSchema');
var availabilitySchema = require('./schema/availabilitySchema');
var notificationSchema = require('./schema/notificationSchema');

if (! process.env.MONGODB_URI){
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}

var connect = process.env.MONGODB_URI;
mongoose.connect(connect)

var User = mongoose.model('User', userSchema);
var Meal = mongoose.model('Meal', mealSchema);
var Mealreview = mongoose.model('Mealreview', mealReviewSchema);
var Userreview = mongoose.model('Userreview', userReviewSchema);
var Request = mongoose.model('Request', requestsSchema);
var Available = mongoose.model('Available', availabilitySchema);
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
