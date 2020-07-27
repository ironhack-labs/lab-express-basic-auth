require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

//al instalar los paquetes npm tenemos que crear las variables para poder utilizarlos
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// require database configuration
require('./configs/db.config');

//Añadimos rutas para auth e index
var authRouter = require("./routes/auth");
var indexRouter = require("./routes/index.routes")

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    }),
    resave: true,
    saveUninitialized: true
  }));

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

//siempre el de ruta va antes que el de indice por el middleware que se encuentra en index
//como no hay filtro de entrada en ese middleware entra el primero y si esta index
// no le da tiempo a comprobar si hay cookies y por lo tanto un currentUser.
app.use('/', authRouter);
app.use('/', indexRouter);




module.exports = app;
