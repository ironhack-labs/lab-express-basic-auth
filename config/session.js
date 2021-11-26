//Configuracion de la sesion
//Persistencia de identidad

// 1. IMPORTACIONES
const session = require("express-session");
const MongoStore = require("connect-mongo");

// 2. GESTIÓN DE SESIÓN
const sessionManager = (app) => {
  // a. Establecer seguridad y flexibilidad ante servidores externos, puntualmente Cloud (Heroku).
  app.set("trust proxy", 1);

  // b. Establecer la configuración de la sesión
  app.use(
    session({
      secret: process.env.SESSION, // PALABRA SECRETA PARA COINCIDIR EN EL SERVIDOR
      resave: true,
      saveUninitialized: false,
      cookie: {
        // ARCHIVO ÚNICO QUE SE GENERA EN EL SERVIDOR CON LOS DATOS ELEGIDOS DEL USUARIO, SE ENVÍA PARCIALMENTE UNA COPIA DE LOS DATOS A LA BASE DE DATOS Y LA COOKIE SE ENVÍA AL CLIENTE.
        httpOnly: true, // FEATURE PARA ENVITAR ATAQUES XSS
        maxAge: 86400000, // 1 milisegundo. 1000*60*60*24 => 24 Horas
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI, //gestiona la copia de la data en MongoDB a traves de una coleccion llamada sesiones
      }),
    })
  );
};

// 3. EXPORTACIÓN
module.exports = sessionManager;
