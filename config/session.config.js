const session = require("express-session");
const MongoStorage = require("connect-mongo");

module.exports = (app) => {
  app.set("trust proxy", 1);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      },
      store: MongoStorage.create({
        mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/basic-auth",
        ttl: 60 * 60 * 24,
      }),
    })
  );
};
