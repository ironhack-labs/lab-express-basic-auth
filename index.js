require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const path = require('path');

// Bienvenidos a un server super limpio,
// aca listo las cosas que tenemos en este archivo

const app = express()

mongoose
    .connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("connected 💾")
    })
    //views

app.set("views", `${__dirname}/views`)
app.set("view engine", `hbs`)


app.use(express.static(path.join(__dirname, 'public')));
//middlewares

app.use(bodyParser.urlencoded({ extended: true }))
    // 1. Un nuevo archivo que en realidad es algo redundante pero mantiene separada la configuracion de nuestro middleware de session
require("./config/session")(app)

// 2. Rutas de express separadas del archivo principal de configuracion
app.use("/", require("./routes"))
    //        👇 podemos poner un prefijo a las rutas si asi lo deseamos
app.use("/auth", require("./routes/auth"))

app.listen(process.env.PORT, () => {
    console.log(`listening http://localhost:3000`)
})