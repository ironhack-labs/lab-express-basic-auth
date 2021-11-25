// ./index.js

// 1. IMPORTACIONES
const express		= require("express")
const app			= express()

const hbs			= require("hbs")

const connectDB		= require("./config/db")
const sessionManager = require("./config/session")

require("dotenv").config()


// 2. MIDDLEWARES

console.log(sessionManager)
sessionManager(app)

app.use(express.static("public"))

app.set("views", __dirname + "/views")
app.set("view engine", "hbs")

hbs.registerPartials(__dirname + "/views/partials")

app.use(express.urlencoded({ extended: true }))


connectDB()

// 3. RUTAS
// LAYOUT MIDDLEWARE
app.use((req, res, next) => {
	res.locals.currentUser = req.session.currentUser
	next()
})

app.use("/auth", require("./routes/auth"))
app.use("/users", require("./routes/users"))
app.use("/", require("./routes/index"))

// 4. SERVIDOR
app.listen(process.env.PORT, () => {
	console.log(`Corriendo en el puerto: ${process.env.PORT}`)
})