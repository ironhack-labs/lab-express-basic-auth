const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const sessionTime = 60 * 60 * 24 * 1000
//SESSION MIDDLEWARE
module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: sessionTime },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: sessionTime,
      }),
    })
  );
};
