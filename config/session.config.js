// config/session.config.js

// require session
const session = require('express-session');

// ADDED: require mongostore
const MongoStore = require('connect-mongo');
 
// ADDED: require mongoose
const mongoose = require('mongoose');

//  export it and have it receive a parameter
module.exports = app => {


  // required for the app when deployed to Heroku (in production)
  app.set('trust proxy', 1);

  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60000 
      },// ADDED code below !!!
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/basic-auth'
      })
    })
  );
};
