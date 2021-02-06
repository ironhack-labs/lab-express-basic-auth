require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('./configs/session.config');
const routes = require('./routes/index.routes');

const app_name = require('./package.json').name;
const User = require('./models/User.model');
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const app = express();

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session);

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + "/views/partials");
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// Cargamos el usuario de la sesion
app.use((req, res, next) => {
    if(req.session.currentUserId){
        User.findById(req.session.currentUserId)
            .then(user => {
                if(user){
                    req.currentUser = user
                    res.locals.currentUser = user
                    next()
                }
            })
    } else {
        next()
    }
})

app.use('/', routes);

module.exports = app;
