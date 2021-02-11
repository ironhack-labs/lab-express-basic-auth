// configs/session.config.js

// require session
const expressSession = require('express-session');
const mongoose = require ('mongoose');
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo(expressSession);

const session = expressSession ({
  secret: process.env.SESS_SECRET || 'super secret (change it)',
  resave: false,
  saveUninitialized: false, 
  cookie: {
    secure: process.env.SESS_SECURE|| false,
    httpOnly: true,
    maxAge: process.env.MAX  || 3600000 
    },
    store: new MongoStore ({
      mongooseConnection: mongoose.connection,
      ttl: 3600000 
    })
})



// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter

module.exports = session;

