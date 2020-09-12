const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')

module.exports = app => {
    // <== app is just a placeholder here
    // but will become a real "app" in the app.js
    // when this file gets imported/required there
   
    // use session
    app.use(
      session({
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 },
        store: new MongoStore({
          mongooseConnection: mongoose.connection,
          ttl: 60*60*24
      })
    })
    )
  };