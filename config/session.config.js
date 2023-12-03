// require session
const session = require('express-session');

// require mongostore
const MongoStore = require("connect-mongo");

// require mongoose
const mongoose = require("mongoose");

module.exports = app => {
  
  app.set('trust proxy', 1);

  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60000 // 1 min
      }
    })
  );
};