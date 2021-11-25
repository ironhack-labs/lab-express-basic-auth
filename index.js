// 1. IMPORTACIONES
const express		= require("express")
const app			= express()

const hbs			= require("hbs")

const connectDB		= require("./config/db")

require("dotenv").config()




// 2. MIDDLEWARES

app.use(express.static("public"))

app.set("views", __dirname + "/views")
app.set("view engine", "hbs")

hbs.registerPartials(__dirname + "/views/partials")

// Necesario para transferir datos de tu formulario a la base de datos
app.use(express.urlencoded({ extended: true }))

// Generar conexion a mi mongoDB
connectDB()



// 3. RUTAS


app.use("/auth", require("./routes/auth"))
app.use("/users", require("./routes/users"))
app.use("/", require("./routes/index"))




// 4. SERVIDOR
app.listen(process.env.PORT, () => {
	console.log(`Corriendo en el puerto: ${process.env.PORT}`)
})

