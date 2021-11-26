// archivo para dar configuración a la página ( seteo de tiempo, cookies)


// 1. IMPORTACIONES EXPRESS-SESSION / CONNECT-MONGO
const session = require("express-session")
const MongoStore = require("connect-mongo")

// 2. GESTIÓN DE SESIÓN - Se setean las configuraciones

const sessionManager = (app) => {

	app.set("trust proxy", 1) // Seguridad en Heroku

    console.log("Activando y gestionando sesion")
	

	app.use(session({ // Seteo de pagina
		secret: process.env.SESSION,// Palabra secreta para servidor
		resave: true,
		saveUninitialized: false,
		cookie: { //Archivo con datos del usuario
			httpOnly: true, // Fevita ataques XSS
			maxAge: 86400000  // vigencia de sesión => 24hrs
		},
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URI
		})
	}))

}

// 3. EXPORTACIÓN
module.exports = sessionManager