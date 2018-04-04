// =======================
// get the packages we need ============
// =======================
var express = require('express');
var app = express();
var cors = require('cors')
app.use(cors())
var Promise = require("bluebird");
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config/config'); // get our config file
var expressValidator = require('express-validator');
// =======================
// Routers =========
// =======================
var userRoute = require('./routes/User.route');
var checkinRoute = require('./routes/Checkin.route');



// =======================
// configuration =========
// =======================
var port = process.env.PORT || 3011; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable
app.use(express.static(__dirname + '/public'));

// use body parser so we can get info from POST and/or URL parameters

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//validator
app.use(expressValidator());

// use morgan to log requests to the console
app.use(morgan('dev'));

mongoose.Promise= Promise;



// =======================
// routes ================
// =======================
// basic route
app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});


app.use('/user', userRoute);
app.use('/api',checkinRoute);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);