const session = require("express-session");

const mongoose = require("mongoose");

const MongoStore = require("connect-mongo")(session);

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: "none",
        httpOnly: true,
        maxAge: null,
      },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24,
      }),
    })
  );
};
