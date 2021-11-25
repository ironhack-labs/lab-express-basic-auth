// 1. Importaciones

const session = require("express-session")
const MongoStore = require("connect-mongo")

// 2. Gestión de sesión

const sessionManager = (app) => {
    
    console.log("Activando y gestionando sesiones")

    // a. Establecer seguridad y flexibilidad ante servidores externos, clouds.
    app.set("trust proxy", 1)

    // b. Establecer configuración de la sesión.
    app.use(session({
      
        secret: process.env.SESSION,
        resave: true,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 86400000
        },
        store: MongoStore.create({
            mongoUrl: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.hptoy.mongodb.net/ih-basic-auth`
        })
    }))

}

// 3. Exportación

module.exports = sessionManager