const User = require("../models/User.model");

const expressSession = require("express-session");


const MongoStore = require("connect-mongo");


const mongoose = require("mongoose");

const MAX_AGE = 7;

module.exports.sessionConfig = expressSession({
    secret: "super-secret", 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
      secure: false, 
      httpOnly: true, 
      maxAge: 24 * 3600 * 1000 * MAX_AGE, 
    },
    store: new MongoStore({
      mongoUrl: mongoose.connection._connectionString, 
      ttl: 24 * 3600 * MAX_AGE, 
    }),
  });
  
  
  module.exports.loggedUser = (req, res, next) => {
    const userId = req.session.userId;
  
    if (userId) {
      
      User.findById(userId)
        .then((user) => {
          if (user) { 
            req.currentUser = user; 
            res.locals.currentUser = user; 
           
            next(); 
          } else {
            next(); 
          }
        })
        .catch((err) => next(err)); 
    } else {
      next(); 
    }
  };