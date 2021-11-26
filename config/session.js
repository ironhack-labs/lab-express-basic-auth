// En este archivo se manejara la gestion de la session de cada usuario en particular
// Ejemplo: La configuracion del tiempo de expiracion de la sesion (Se configura UNA vez)


// 1. IMPORTACIONES (Se instalan ambas)

const session = require("express-session")
const MongoStore = require("connect-mongo")


// 2. GESTION DE SESION (De cada usuario en particular)
// (Configuracion basica de seguridad, establecida en la documentacion)
const sessionManager = (app) => {


    // a) Se establece seguridad basica y flexibilidad ante servidor externo (Como Heroku (Cloud))
    app.set("trust proxy", 1)



    // b) Aqui se ESTABLECE configuracion basica para el mantenimienot de la sesion de mi usuario logeado

    app.use(session({

        // Opciones de la session
        secret: process.env.SESSION, // Palabra secreta to sign the session cookie
        resave: true, // Defalut value: true, Forces the session to be saved back to the session store
        saveUninitialized: false, //  Choosing false is useful for implementing login sessions, reducing server storage usage,
        cookie: { // Archivo unico que se guarda igual en mi base de datos con los datos elegidos del usuario, se envia una copia a  mi base de datos y otra al cliente.
            httpOnly: true, //  Para evitar ataques XSS
            maxAge: 86400000 // 1 milisegundo, 24 Horas
        }, 
        store: MongoStore.create({
            // Puente que guarda los cookies generados en la base de datos
            mongoUrl: process.env.MONGODB_URI
        })
    }))

}







// 3. EXPORTACION

module.exports = sessionManager