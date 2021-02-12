const expressSession = require('express-session')
const mongoose = require('mongoose')
const connectMongo = require('connect-mongo')
const { MongooseDocument } = require('mongoose')

const MongoStore = connectMongo(expressSession)
// Para que no me roben la cookie ciframos
const session = expressSession({
    secret: process.env.SESSION_SECRET || 'super secret',
    //No crea la cookie hasta que no guarde nada
    saveUninitialized: false,
    resave: false,
    cookie: {
        //Solo se pueden hacer peticiones desde dominios https para que nmos encripte la info de las peticiones, lo pnemos en false para que en local nos funcione
        secure: process.env.SESSION_SECURE || false,
        // para que la cookie de la sesion no la puedas tocar
        httpOnly: true,
        maxAge: process.env.SESSION_MAX_AGE || 360000
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: process.env.SESSION_MAX_AGE || 360000
    })
})

module.exports = session