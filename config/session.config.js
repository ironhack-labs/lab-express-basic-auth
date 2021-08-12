const session = require("express-session");

const MongoStore = require("connect-mongo");


module.exports = (app) => {
  app.use(
    session({
      secret: 'doesnt matter',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 },
      store: MongoStore.create({
        mongoUrl: process.env.MONGOURI,
        // ttl => time to live
        // ttl: 60sec * 60min * 24h => 1 day
      }),
    })
  );
};
