const session = require("express-session")    // what it does

// ADDED: require mongostore
const MongoStore = require('connect-mongo');

// ADDED: require mongoose
const mongoose = require('mongoose');


module.exports = app => {
  app.set('trust proxy', 1);

  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET, // the access token will be saved in .env file so the others wont have access to the session action.
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60000 // 60 * 1000 ms === 1 min
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/basic-auth'
        // ttl => time to live
        // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
      })
    })
  );
}
