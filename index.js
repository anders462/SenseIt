var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dotenv = require('dotenv').config({silent: true}); // make .env available to process.env
var cors = require('cors'); // Cors configuration. NEED TO SET UP CORS!!!!
var authenticate = require('./authenticate');
var passport = require('passport');
var users = require('./routes/users');
var config = require('./config');
var deviceRouter = require('./routes/deviceRoutes');
var sensorRouter = require('./routes/sensorRoutes');
var activateRouter = require('./routes/activateRoutes');
var dataRouter = require('./routes/dataRoutes');
var mqttListner = require('./mqtt/mqttListner');



//Mongoose Connect
mongoose.connect(config.mongoUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to MongoDB server");
});

var app = express();
app.set('port', (process.env.PORT || 3000));   // set port for server


//add middlewares
app.use(cors());  //add CORS to all routes

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev')); //add morgan middleware logger
//add middleware parser for urlencoded body data POST and URL JSon params
app.use(bodyParser.urlencoded({extended:false})); //extended = false option => use querystring library
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));//mount static route public
app.use('/users', users);
app.use('/devices', deviceRouter);
app.use('/sensors', sensorRouter);
app.use('/activate', activateRouter);
app.use('/data', dataRouter);



//Need to fix this error handler one!!!!!!!!!!
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(err.status).json({})
  //next(err);
});

// Start Mqtt listner
mqttListner();

// Start the server
app.listen(app.get('port'), function(){
  console.log(process.env);
  console.log("server is running on port " + app.get('port') + "...");
});


module.exports = app;
