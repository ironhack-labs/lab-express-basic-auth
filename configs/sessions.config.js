const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

module.exports = (app) => {
  console.log(`This is being run`);
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      name: "appCookie",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 60000, // 1 minute
      },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 14 * 24 * 60 * 60,
      }),
    })
  );
};
