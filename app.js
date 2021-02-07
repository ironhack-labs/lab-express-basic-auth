require('dotenv').config();


const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration
require('./configs/db.config');
//require session configuration

const session = require('./configs/session.config');

//importamos modelo User para validar estado de la sesión del usuario
const User = require('./models/User.model');

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session);

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'LAB | Basic Auth';

// Middleware de validación de usuario de sesión antes de llamar a las rutas para que se disponga de la información de la sesión cuando se ejecute la ruta solictada
app.use((req,res,next) =>{
    if (req.session.currentUserId){
        User.findById(req.session.currentUserId)
        .then((user) => {
            if  (user) {
                // guardo en req una variable a la que llamamos currentUser donde guardamos el usuario para que todas las rutas dispongan de ello.
                req.currentUser = user
                // lo guardamos en el res.locals para que todas vistas tengan acceso a el
                res.locals.currentUser = user
                next() // como esto es un middleware hay que incluir un next para que continue con la siguiente ejecución 
            } else {
                next()
            }
        })
        .catch((e) => next(e))
    } else {
        next()
    }
})
const index = require('./routes/index.routes');
const user  = require('./routes/user.routes');
app.use('/', index);
app.use('/', user);

module.exports = app;
