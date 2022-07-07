var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const compression = require('compression');


// add in redis lib -- start
// var redis = require('redis');
// var bluebird = require('bluebird');
// global.Promise = bluebird;
// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);
// add in redis lib -- end

const dbConnect = require('./lib/mongoDbConnect');
 
 const dbUrl = process.env.MONGO_DB_URL||'mongodb://localhost/events';
 dbConnect.connect(dbUrl);

// creating redis connection -- start
// var redisClient = redis.createClient({ 
//     host: process.env.REDIS_MASTER_SERVICE_HOST||'127.0.0.1', 
//     port: 6379 
// });
  
// redisClient.on('ready', function () {
//   console.log("Redis is ready");
// });
  // creating redis connection -- end

 
const mongo  = require('mongoose');

mongo.connect(process.env.MONGO_DB_URL)
    .then(res => {
        console.log('Connected to mongoDB');
    })
    .catch(err => {
        console.log(err)
    })


 
var indexRouter = require('./routes/index');


var app = express();
app.use(compression());
app.use(cors())

// attaching redis to app
// app["redisClient"] = redisClient;

app["basePathM"] = __dirname;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/cheeta-tags', require('./routes/tags'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
