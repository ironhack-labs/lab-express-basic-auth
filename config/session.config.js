const expressSession = require('express-session'); // Generar sesiones en Express
const MongoStore = require('connect-mongo'); // Almacenar datos de sesión dentro de nuestra base de datos
const mongoose = require('mongoose');
const User = require('../models/User.model'); // Requiere el modelo del usuario y por tanto, al usuario de la sesión

const sessionMaxAge = process.env.SESSION_AGE || 7; // Máximo de días en los que la cookie estará activa

module.exports.sessionConfig = expressSession({
    secret: process.env.COOKIE_SECRET || 'Super secret (change it!)',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 3600 * 1000 * sessionMaxAge,
        httpOnly: true
    },
    store: new MongoStore({
        mongoUrl: mongoose.connection._connectionString,
        ttl: 24 * 3600 * sessionMaxAge,
    })
});


module.exports.loadUser = (req, res, next) => {
    const userId = req.session.userId; // ID de la sesión
    
    if (userId) {
        User.findById(userId) // Busca al usuario con esa ID de sesión
            .then(user => { // Si lo hay...
                res.locals.currentUser = user // Guarda al usuario de la sesión con el nombre "currentUser" para usarlo en todas las vistas
                req.user = user
                next()
            })
            .catch(err => next(err))
    } else {
        next()
    }
    
}
