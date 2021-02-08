require('dotenv').config();

// const cookieParser = require('cookie-parser');      // express session a partir de la V5 ha metido cookie parser, se borra para eviar problemas de configuración
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const session = require('./configs/session.config')
const User = require('./models/User.model')
const app = express();

// require database and session config
require('./configs/db.config');


// Middleware Setup
app.use(logger('dev'));                             // al hacer una petición que nos lo saque en consola bonito
app.use(express.json());                            // parsear req.body para que llegue a express y manejarlo (body parser no es necesario porq a partir de x versión ya lo incluyeron en express)
app.use(express.urlencoded({ extended: false }));   // ""
// app.use(cookieParser());
app.use(session)                         

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));         // donde están mis vistas
app.set('view engine', 'hbs');                           // motor de vistas es hbs
app.use(express.static(path.join(__dirname, 'public'))); // se quede expuesto en una ruta sencilla
hbs.registerPartials(__dirname + '/views/partials')
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// middlerware de sesion
app.use((req, res, next) => {
    if (req.session.currentId) {
        User.findById(req.session.currentId)
                .then((u) => {
                    req.currentUser = u
                    res.locals.currentUser = u

                    next()
                })
                .catch(e => next(e))
    } else {
        next()
    }
})
// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./configs/routes/index.routes'); // middleware de rutas
const user = require('./configs/routes/user.routes')
app.use('/', index); 
app.use('/', user)

module.exports = app; // para ir a los middleware de errores y la inicialización del puerto en www
