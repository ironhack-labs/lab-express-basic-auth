const session = require('express-session');
const MongoStore = require('connect-mongo');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/lab-express-basic-auth";

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "super secret (change it)",
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.SESSION_SAME_SITE || 'lax',
        httpOnly: true,
        maxAge: 86400000,  // 1day
        secure: process.env.SESSION_SECURE || false
      },
      store: MongoStore.create({
        mongoUrl: MONGO_URI,
      })
    })
  )
}
