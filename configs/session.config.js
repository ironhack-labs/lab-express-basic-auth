const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = app => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      rolling: true,
      saveUninitialized: false,
      name: 'my-cookie',
      cookie: {
        path: '/',
        // secure: true,
        sameSite: false,
        httpOnly: true,
        maxAge: 60 * 60 * 24 // 60 * 1000 ms === 1 min
      },
      store: MongoStore.create({
        // <== ADDED !!!
        mongoUrl: process.env.MONGODB_URI,
 
        // ttl => time to live
        ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
      })
    })
  );
}