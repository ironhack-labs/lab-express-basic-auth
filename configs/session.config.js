const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose')

//creando la cookie

module.exports = app => { ////no ayuda a exportarlo y lo importamos en la pagina donde lo necesitemos
                            ///app es el parametro de una funcion, al momento de importarlo hayque incolar este parametro
    app.use(
        session({
            secret: process.env.SESS_SECRET, //password del proyecto para que le usuario pueda guardar sesiones. ´Pass de la sesion'
                                            //alguien con este pass podria ver a todos los usuarios que estan logeados
            resave: true,
            saveUninitialized:false,
            cookie: {
                sameSite:false,
                httpOnly:true,
                maxAge:60000  ///siempre tiene que ir en milisegun
            },
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                ttl: 60*60*24 ///este empiza en seg
            })
        })
    )
}