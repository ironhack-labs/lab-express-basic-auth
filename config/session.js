//GESTION DE LA SESSION DE USUARIOS

//1. IMPORT
const session = require("express-session")
const MongoStore = require("connect-mongo")


//2. Gestion de Rutas:
const sessionManager = (app) =>{

    console.log("GESTION DE SESIONES ACTIVADA 🤖 ")
    //A. Seguridad y flexibilidad (Heroku)
    app.set("trust proxy", 1)

    //B. Config de Sesion:
    app.use(session({ //invoca la libreria que importamos
        secret: process.env.SESSION,
        resave: true,
        saveUninitialized: false,// si no hay cookie, no te inserta la cookie hasta que iniciar sesion
        cookie: {
            httpOnly: true,
            maxAge: 86400000 //Expiracion del token en mil/seg 1000*60*60*24 = 1 dia
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI
        })
    }))
}

//3.EXPORT

module.exports = sessionManager