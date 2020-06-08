// Require the express-session package
const session = require('express-session');
// Require the connect-mongo package and mongoose
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

// Exporting the session to the app.js file
module.exports = app =>{
    // use session
    app.use(
      session({
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 },
        // Setting a time that the session will be mantained if the user doesn't logout
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            ttl: 60 * 60 * 48 // (seconds/minutes/hours) => 2 days
          })
      })
    );
  };