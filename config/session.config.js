//1.Session.  Crear archivo session.config e instalar express-session y connect-mongo


const session = require('express-session');         // instalar     
const MongoStore = require('connect-mongo');        // instalar
const mongoose = require('mongoose');

//2.Configurar en el .env el SESS_SECRET y el MONGODB_URI
//3.En app.js requerir este archivo
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
        maxAge: 1000 * 60 * 60 * 24 * 7
      },
      store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
    })
  );
};
