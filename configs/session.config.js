const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

// vamos a utilizar este middleware en app.js,por lo tanto lo tenemos que exportar
module.exports = app => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60*60*1000 }, // La sesión permanecerá 1 hora abierta
      store: new MongoStore({
        // <== ADDED !!!
        mongooseConnection: mongoose.connection,
        // ttl => time to live
        ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
      })
    })
  );
};