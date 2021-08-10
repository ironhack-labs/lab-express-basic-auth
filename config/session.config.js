const session = require("express-session");

const MongoStore = require("connect-mongo");

const mongoose = require("mongoose");

const connectDB = require("../db/index");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 },
      store: MongoStore.create({
        mongoUrl: connectDB(),
        // ttl => time to live
        // ttl: 60sec * 60min * 24h => 1 day
      }),
    })
  );
};
