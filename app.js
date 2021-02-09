//Dotenv es un módulo de dependencia cero que carga variables de entorno desde un .envarchivo a process.env.
require('dotenv').config();

//El módulo de errores HTTP se utiliza para generar errores para las aplicaciones Node.js. 
const createError = require("http-errors"); 

//Requerimos el modulo express para utilizar sus funciones y variables
const express = require('express');

//Middleware que nos da más info en los logs de consola
const logger = require('morgan');

//Motor de vistas que utilizamos
const hbs = require('hbs');

//Requerimos routes para configurar todas nuestras rutas en un archivo
const routes = require("./config/routes");

//requirimos la configuracion de conexion en el archivo de a continuacion
require('./config/db.config')

//=================Configuracion de Express=========================

//Configuramos la instacia de express
const app = express();

//Middleware para solicitudes POST que envía datos al servidor y le pide que acepte o almacene esos datos (objeto),
//que están incluidos en el cuerpo (es decir, req.body) de esa solicitud (POST)
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Configuramos carpeta public con express para poder usar css e imagenes en nuestras views
app.use(express.static("public"));

//Middleware para poder meter logs en consola
app.use(logger("dev"));

//Configuramos la ruta que contiene la vistas
app.set("views",__dirname +"/views");

//Configuramos el motor de vistas que vamos a utilizar
app.set("view engine", "hbs");

//Registramos los partials
hbs.registerPartials(__dirname+"/views/partials");

//Seteamos el / para poder utilizar las rutas
app.use("/", routes);

//Establecemos un Middleware de errores genérico para errores que no podamos manejar
app.use((req,res,next) => {
    next(createError(404));
})

app.use((error, req, res, next) => {
    console.log(error)
    if(!error.status) {
        error = createError(500);
    }
    res.status(error.status);
    res.render("error",error);
});

// Inicializacion en Puerto
const PORT = process.env.PORT || 3000
app.listen(PORT, () => 
console.log(`Listening on port ${PORT}`)
);


