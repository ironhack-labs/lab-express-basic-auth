//import session
//Require session
const session = require('express-session');

//Require mongostore
const MongoStore = require('connect-mongo');

module.exports = app => {
  app.set('trust proxy', 1);
 
  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60000 // 60 * 1000 ms === 1 min
      },
      //MongoStore Code
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/basic-auth'
      })


    })
  );
};