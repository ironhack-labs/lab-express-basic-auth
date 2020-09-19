const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const activateSession = (app) => {
  app.use(session({
    secret: 'saduygduygduyguydsagufyfvvfuyguyguyfguyfagauygadyu',
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: { maxAge: 1200000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24,
    }),
  }));
};

module.exports = activateSession;
