const session = require('express-session');
const MongoDbStore = require('connect-mongo')

module.exports = app => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: false,
        httpOnly: true,
        maxAge: 600000 // 60 * 1000 ms === 1 mi
        },
        store: MongoDbStore.create({
                    mongoUrl: process.env.MONGODB_URL
        })
    }));
    };