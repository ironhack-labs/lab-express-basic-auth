const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const User = require('../models/User.model')

module.exports = (app) => {
    app.use(
      session({
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 }, // 60 * 1000 ms === 1 min
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            // ttl => time to live
            ttl: 60 * 60 * 24, // 60sec * 60min * 24h => 1 day
        })
      })
    );
};


module.exports.isAuthenticated = (req, res, next) => {
  console.log(req.session.userId)
  User.findById(req.session.userId)
    .then(user => {
      if (user) {
        req.currentUser = user
        res.locals.currentUser = user

        next()
      } else {
        res.redirect('/login')
      }
    })
}