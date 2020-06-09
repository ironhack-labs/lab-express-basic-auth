const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose')

module.exports = app => {
    app.use(
        session({
            secret:process.env.SESS_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 8*60*60*1000}, //tempo inativo para desconectar o usuário => 8 horas
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                ttl: 8*60*60*1000 
            })
        })
    )
}