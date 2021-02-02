const session = require('express-session');
const MongoStore = require("connect-mongo")(session) 
const mongoose = require('mongoose')

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SEC, 
      resave: true,
      saveUninitialized: false,
      cookie: { 
        maxAge: 60000
      },
        store: new MongoStore({
          mongooseConnection : mongoose.connection,
          ttl: 24 * 60 * 60
      })
    })
  );
};


