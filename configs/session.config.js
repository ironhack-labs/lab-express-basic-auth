// express-session genera las sesiones. El que se conecta con mi front y guarda la info en el proceso. guiarda info en un estado para que en cada peticion se mande con el objeto req.sesion al que le metemos info
// Connect-mongo genera las sessions en la BD es para que si el puerto se cierre o no, la sesión se guarde en base de datos y no viva en el proceso de node.
// Store en mongo es una collecion dentro de la dbs porq usamos mongoose y este se conectará con mongo

// La cookies se guardan en el lado del cliente. Identificador que se manda en todas las peticiones que se hagan al backend y saber quién hace la petición.
// Cookie de sesion: id que mantengo para hablar con backend

require('dotenv').config();
const sessionExpress = require('express-session');
const mongoose = require('mongoose')
const connectMongo = require('connect-mongo')

const mongoStore = connectMongo(sessionExpress)         // Creo una mongostore asociada a expresssesion - cómo se contecta. Que sesiones tiene que guardar.


const session = sessionExpress({
        secret: process.env.SESS_SECRET || 'Top secret', // lo que consigue que no te roben la cookie
        resave: false,                                   // no se sabe para que lo quiero pero hacemos caso a la documentación
        saveUninitialized: false,                        // no guarda datos hasta que no guarde nada. Recomendado en false para login, reduce la carga de datos en el servidor.
        cookie: {
            secure: process.env.SESS_SECURE || false,    // solo se puden hacer peticiones desde dominios https que nos encripta las peticiones y es más seguro. Localhost no lo tiene por eso false
            httpOnly: true,                              // para que no se pueda trabajar desde el navegador
            maxAge: process.env.Sess_AGE || 3600000      // miliseconds             
        },
        store: new mongoStore ({                          // instancio mongostore
            mongooseConnection: mongoose.connection,     // configuro la conexion con mongoose
            ttl: process.env.Sess_AGE || 3600000,        // Con cada petición que hagas se refresca la cookie con cuanto t. (así expira la cookie al mismo tiempo en la bd y en el front)
        })
})

module.exports = session

