const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

module.exports = app => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 300000 // 60 * 5000 ms === 5 minutes
      },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
      })
    })
  );
};