/**
 * Auth API service.
 */

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
//const cors = require('cors');
const aws = require('aws-sdk');
const passport = require('passport');
require('dotenv').config();
const passportService = require('./lib/services/passport.service');

var errors = require('./lib/routes/errors');
var routes = require('./lib/routes')(passport);

// Express app
const app = express();

// CORS




app.use(cors({ 
	allowedHeaders: 'Authorization, Content-Type',
	origin: '*', 
	methods: 'GET,PUT,POST,DELETE'
}));

// logger
if (app.get('env') === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger());
}

app.use(express.limit('10M'));

// body parser
app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));
// passport
passportService(passport).configure();




// routes
app.use('/', routes);

// error handlers
app.use(errors.notfound);
app.use(errors.error);

module.exports = app;
