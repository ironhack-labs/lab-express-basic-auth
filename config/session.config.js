
//Llamo al express session
const session = require('express-session')
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');


//exporto en un placeholder "APP" que será el middleware para el app en app.js
module.exports = app => {

  app.set('trust proxy', 1);

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
      store: MongoStore.create({
          mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/lab-express-basic-auth"
      })
    })
  );
};
