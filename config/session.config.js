// Para iniciar la sesión. Instalar paquete de npm
const session = require('express-session');

// Para guardar los paquetes en la DB. Instalar paquete de npm
const MongoStore = require('connect-mongo');

// DB
const DB_NAME = 'demo-register';
const URI = 'mongodb://localhost:27017';

module.exports = (app) => {
    app.use(
        session({
            secret: process.env.SESSION_SECRET || 'super secret (change it)',
            resave: true,
            saveUninitialized: false, // Para no tener sesiones vacías en DB
            cookie: {
                sameSite: process.env.SESSION_SAME_SITE || 'lax',
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24, // Cuánto dura la cookie en milisegundos (1 día)
                secure: process.env.SESSION_SECURE || false // Solo acepta peticiones a través de HTTPS
            },
            // Para almacenar en DB
            store: MongoStore.create({
                mongoUrl: `${URI}/${DB_NAME}`
            })
        })
    )
}