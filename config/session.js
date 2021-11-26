//IMPORTS:
const session = require ("express-session")
const MongoStore = require ("connect-mongo")

const sessionManager = (app)=>{
    console.log("Activando y gestionando sesiones")
   //Establecer seguridad y flexibilidad ante servidores externos, puntualmente tipo Cloud (Heroku)
  app.set("trust proxy", 1)
  //establecer la configuracion de la sesion
  app.use (session({
      secret: "PAPEPIPOPU",//Palabra secreta para coincidir en el servidor al momento de generar cookie de sesion
      resave: true, // reintegra la cookie en el caso de ser borada
      saveUninitialized: false, //si navegas como visitante, no se genera la cookie, si generas un registro, se genera la cookie, este valor permite eso
      cookie: {  //archivo unico que se genera en el servidor con los datos elegidos del usuario, se envia parcialmente una copia de los datos a la base de datos y la cookie se envía al cliente.
        httpOnly: true, //feature para evitar ataques XSS
        maxAge: 86400000 // 1 milisegundo. 1000*60*60*24 => esto son para 24 hrs
      },
      store: MongoStore.create({
          mongoUrl: process.env.MONGODB_URI
      })
    }))
 }

 module.exports = sessionManager