// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejs = require('ejs');
var morgan = require('morgan');
var beerController = require('./controllers/beerController');
var userController = require('./controllers/userController');
var clientController = require('./controllers/clientController');
var authController = require('./controllers/auth');
var oauth2Controller = require('./controllers/oauth2');

// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://localhost:27017/beerlocker');

// Create our Express application
var app = express();
// Set view engine to ejs
app.set('view engine', 'ejs');

// use morgan
app.use(morgan('dev'));

// Use the body-parser package in our application for parsing POST request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use express session support since OAuth2orize requires it
app.use(session({
  secret: 'Super Secret Session Key',
  saveUninitialized: true,
  resave: true
}));

// use passport in our application
app.use(passport.initialize());

// Create our Express router
var router = express.Router();

// Register all our routes with /api
app.use('/api', router);

//Insert the isAuthenticated funtion in the callback chain for our endpoint handlers. 
//If a call is made to any of these endpoints without a valid username and password, the request will be denied with a 401 HTTP response.
// Create endpoint handlers for /beers
router.route('/beers')
  .post(authController.isAuthenticated, beerController.postBeers)
  .get(authController.isAuthenticated, beerController.getBeers);

//Create endpoint handlers for /beers/:beer_id
router.route('/beers/:beer_id')
  .get(authController.isAuthenticated, beerController.getBeer)
  .put(authController.isAuthenticated, beerController.putBeer)
  .delete(authController.isAuthenticated, beerController.deleteBeer);


// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);


// Create endpoint handlers for /clients
router.route('/clients')
  .post(authController.isAuthenticated, clientController.postClients)
  .get(authController.isAuthenticated, clientController.getClients); 

// Create endpoint handlers for oauth2 authorize
router.route('/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);

// Create endpoint handlers for oauth2 token
router.route('/oauth2/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token);

// Start the server
app.listen(3000,function(){
  console.log('server listening at port 3000');
});