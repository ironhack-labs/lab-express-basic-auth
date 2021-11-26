//Aqui se hará la gestión de la sesión. Esto incluye la configuración y tiempo de expiración de la sesión.
// Importacion de librerías
// Instalaremos la librería para las sesiones. express-session y connect-mongo
const session = require('express-session');
const MongoStore = require('connect-mongo')

//Gestionamos la sesión
const sessionManager = (app) => {
      //1. Establecemos seguridad y flexibilidad ante servidores externos. Para este caso servidores en la nube (Heroku).
      app.set("trust proxy", 1) //confiar en todos los elementos cloud que se puedan aplicar.
      //2. Establecer la configuración base.
      app.use(session({
            secret: 'secret',
            resave: true,
            saveUninitialized: false,
            cookie: {
                  //Este es un archivo unico que se genera en el servidor con los datos elegidos por el usuario, se envia parcialmente una copia de la bae de los datos y la cookie se envia al cliente.
                  httpOnly: true,
                  maxAge: 86400000,

            },
            store: MongoStore.create({
                  mongoUrl: process.env.MONGODB_URI
            })
      }))
}
module.exports = sessionManager