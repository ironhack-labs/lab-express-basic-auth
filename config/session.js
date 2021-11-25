// 1. IMPORTACIONES
const session = require("express-session")
const MongoStore = require("connect-mongo")

const sessionManager = (app) => {

	app.set("trust proxy", 1)

	app.use(session({
		secret: "HOLAMUNDO", 
		resave: true,
		saveUninitialized: false,
		cookie: { 
			maxAge: 86400000  
		},
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URI
		})
	}))
}

// 3. EXPORTACIÓN
module.exports = sessionManager