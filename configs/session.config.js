const session = require("express-session");

const MongoStore = require("connect-mongo");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      cookie: {
        httpOnly: true,
        maxAge: 60000,
      },
      store: new MongoStore({
        mongoUrl: "mongodb://localhost/express-basic-auth-dev",
        ttl: 60 * 60 * 24,
      }),
    })
  );
};
