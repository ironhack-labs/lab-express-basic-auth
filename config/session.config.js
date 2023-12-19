const session = require("express-session");
const MongoStore = require("connect-mongo");
// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = (app) => {
  // function(app){...}
  // <== app is just a placeholder here
  // but will become a real "app" in the app.js
  // when this file gets imported/required there

  // required for the app when deployed to Heroku (in production)
  app.set("trust proxy", 1);

  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60,
        // maxAge: 1000 * 60 * 60 * 24 //--> 1day
      },
      store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/lab-express-basic-auth",
      }),
      //   cookie: {
      //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      //     secure: process.env.NODE_ENV === 'production',
      //     httpOnly: true,
      //     maxAge: 60000 // 60 * 1000 ms === 1 min
      //   }
    })
  );
};
