// configs/session.config.js

// require session
const expressSession = require('express-session');
const mongoose = require ('mongoose');
const connectMongoose = require('connect-mongo');
const MongoStore = connectMongoose(expressSession);

const session = expressSession ({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: false, // true la cookie se almacena aunque no se haya confirmado el inicio de sesión. false no se almacena hasta que se confirma el inicio de sesión
  cookie: {
    secure: process.env.SESS_SECRET || false,
    httpOnly: true,
    maxAge:  3600000 // 360 * 1000 ms === 1 hora Tiempo de duración de la cookie. Despues se borra
  }
});



// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter

module.exports = session;

