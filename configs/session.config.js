const session = require("express-session")
require("dotenv").config()
const mongoose = require("mongoose")
const MongoStore = require("connect-mongo")(session)

const connectSession = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        // time to live
        ttl: 60 * 60 * 24,
      }),
    })
  );
};

module.exports = connectSession;