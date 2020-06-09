//Todas las configuraciones necesarias para una sesion

const session = require("express-session");

// configs/session.config.js
const MongoStore = require('connect-mongo')(session);

// ADDED: require mongoose
const mongoose = require('mongoose');


//middleware function para crear o recoger una sesión existente

module.exports = app => {

    app.use(

        session({
            secret: process.env.SESS_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 600000
            }, //1 minuto
            store: new MongoStore({
                // <== ADDED !!!
                mongooseConnection: mongoose.connection,
                // ttl => time to live
                ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
              })
        

        })
    );
};