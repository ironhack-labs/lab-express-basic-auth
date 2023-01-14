const session = require("express-session");

const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 10000,
      },
      store: MongoStore.create({
        mongoUrl:
          process.env.MONGODB_URI ||
          "mongodb://127.0.0.1/lab-express-basic-auth",
      }),
    })
  );
};
