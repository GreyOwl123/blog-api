if (process.env.NODE_ENV !== "production") {
   require('dotenv').config();
}

import bcryptjs from 'bcryptjs';
import createError from 'http-errors';
const express = require('express');
import path from 'path';
import cookieParser from 'cookie-parser';
import logger  from 'morgan';
import async from "async";
import passport from "passport-jwt";
import session from 'express-session';
import LocalStrategy from "passport-local";
import Author from './models/author';


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

// Mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_DB_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

passport.use(
  new LocalStrategy( async(username, password, done) => {
   try {
     const user = await Author.findOne({ username: username });
     if (!user) {
       return done(null, false, { message: "Incorrect username" });
     };
     bcryptjs.compare(password, user.password, (err, res) => {
      if (res) {
       user.password === password
     return done(null, user);
     }
      else {
       user.password !== password
     return done(null, false, { message: "Incorrect password" })
   } 
      })
   } catch(err) {
   return done(err);
  };
  })
 );

 passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
 try {
   const user = await Author.findById(id);
   done(null, user);
  } catch(err) {
    done(err, user);
  };
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initalize());
app.use(passport.authenticate('session'));

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

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
