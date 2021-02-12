const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose')

//creando la cookie

module.exports = app => {
    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: false,
            saveUninitialized:false,
            cookie: {
                sameSite:'none',
                httpOnly:true,
                maxAge:120000
            },
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                ttl: 60*60*24
            })
        })
    )
}