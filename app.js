require('dotenv').config();
//configs
require('./configs/db.config');
const session = require('./configs/session.config')

//rutas
const routes = require('./routes/index.routes')

const cookieParser = require('cookie-parser');
const express = require('express');

const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const sessionMiddleware = require('./middlewares/session.middleware') //requiero el middleware de la sessión

const User = require('./models/User.model')


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration


// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(__dirname + '/public')); //esta es la ruta que me sirve
app.use(session) //aqui le digo que use la session de las coockies
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

app.use(sessionMiddleware.findUser)

/*app.use((req, res, next) => {
    if (req.session.currentUserId) {
        User.findById(req.session.currentUserId)
            .then(user => {
                if (user) {
                    req.currentUser = user
                    res.locals.currentUser = user
                    next()
                }

            })
    } else {
        next()
    }
}) esto lo pase a ssesion.middleware.js*/


app.use('/', routes);

module.exports = app;

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>
    console.log(`Listening on port ${PORT}`)
);