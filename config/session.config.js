const session = require('express-session');

module.exports = app => {
    // <== app is just a placeholder here
    // but will become a real "app" in the app.js
    // when this file gets imported/required there
   
    // required for the app when deployed to Heroku (in production)
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
        }
      })
    );
  };