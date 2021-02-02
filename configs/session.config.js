const session = require('express-session');


module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SEC, 
      resave: true,
      saveUninitialized: false,
      cookie: { 
        //maxAge: 600000 // 1hr 
        maxAge: 12000
      }
    })
  );
};


