const express = require('express');
var session = require('express-session')
const bodyParser = require('body-parser')
import passport from './routes/passport'
import auth from './routes/auth'
import users from './routes/users'
import meals from './routes/meals'
import chefs from './routes/chefs'
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
const app = express();
const server = require('http').Server(app);

app.use(session({ secret: "tractor",
// store: new MongoStore({mongooseConnection: require('mongoose').connection}),
})); //secret string is used to hash the cookie
app.use(bodyParser.urlencoded({ extended: false })); //doesn't matter if the body is json or not
app.use(bodyParser.json({limit: '50mb'})) // turning post requests into json objects
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('hello')
})

app.use('/auth', auth(passport))
app.use('/meal', meals)
app.use('/user', users)
app.use('/chef', chefs)

const PORT = process.env.PORT || 3005;
server.listen(PORT, error => {
  error
  ? console.error(error)
  : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
