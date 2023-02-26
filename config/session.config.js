const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose')

module.exports = (app) => {
    app.set('trust proxy', 1); // trust first proxy
    app.use(
        session({
        secret: process.env.SESS_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000,
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/basic-auth'
     
            // ttl => time to live
            // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
          })
        })
      );
    };