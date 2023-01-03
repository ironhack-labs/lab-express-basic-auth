const session = require('express-session');
const MongoStore = require('connect-mongo');
// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = app => {
  // <== app is just a placeholder here
  // but will become a real "app" in the app.js
  // when this file gets imported/required there
 
  // required for the app when deployed to Heroku (in production)
  app.set('trust proxy', 1);
 
  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET || 'my super secret',
      resave: true,
      saveUninitialized: true,
      store: MongoStore.create({ 
        mongoUrl: 'mongodb://127.0.0.1:27017/basic-auth', // setting the connection string to save my store
        ttl: 24 * 60 * 60 // the time to live for my session
    }),
      cookie: {
        // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        // secure: process.env.NODE_ENV === 'production',
        // httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 60 * 1000 ms === 1 min
      }
    })
  );
};