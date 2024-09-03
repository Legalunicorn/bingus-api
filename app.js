const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors")
require("dotenv-flow").config()
const apiRouter = require("./routes/apiRouter")
//TODO import passportset i think i dont know why i have to

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

/**
 * ======================== MIDDLEWARE ========================
 */
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * ======================== ROUTES ========================
 */

app.use("/api",apiRouter)


/**
 * ======================== ERROR HANDLER ========================
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use((err,req,res,next)=>{
  console.log(`$Error: ${err.message} ${err.status || 'no status'}`)
  console.log("======== ERR STACK ========")
  console.log(err.stack);
  
  res.header("Content-Type","application/json")
  res.status(err.status || 400).json({error:err.message} || 'Something went wrong.')
})


// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
