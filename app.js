require('dotenv').config();

const bodyParser            = require('body-parser');
const cookieParser          = require('cookie-parser');
const express               = require('express');
const favicon               = require('serve-favicon');
const hbs                   = require('hbs');
const mongoose              = require('mongoose');
const logger                = require('morgan');
const path                  = require('path');
const chalk                 = require('chalk');
const session               = require('express-session');
const bcrypt                = require('bcrypt');
const MongoStore            = require('connect-mongo')(session)

const app_name              = require('./package.json').name;
const debug                 = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app                   = express();


//CONFIGURACIÓN DE LAS COOKIES
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 
  })
}));

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
hbs.registerPartials(__dirname + "/views/partials")


// default value for title local
app.locals.title = 'Basic Auth Lab';

const index = require('./routes/index.routes');
app.use('/', index);
app.use('/sign-up', index);
app.use('/log-in', index);
app.use('/main', index);
app.use('/private', index);


module.exports = app;

//CONFIGURACIÓN PUERTO
app.listen(process.env.PORT, ()=>{
    console.log(chalk.green.inverse.bold(`Conectado al puerto ${process.env.PORT}`));
  });