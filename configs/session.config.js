// configs/session.config.js

// require session
const session = require('express-session');

// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = (app) => {
  // <== app is just a placeholder here
  // but will become a real "app" in the app.js
  // when this file gets imported/required there

  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: false, // true la cookie se almacena aunque no se haya confirmado el inicio de sesión. false no se almacena hasta que se confirma el inicio de sesión
      cookie: { maxAge: 360000 }, // 360 * 1000 ms === 1 hora Tiempo de duración de la cookie. Despues se borra.
    })
  );
};
