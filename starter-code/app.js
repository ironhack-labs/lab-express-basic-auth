require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const path         = require('path');

require('./config/db.config');
require('./config/hbs.config');
const session = require('./config/session.config.js');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const home = require('./routes/home.routes');
const auth = require('./routes/auth.routes');
const users = require('./routes/user.routes');


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session);

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

app.use('/', home);
app.use('/', auth);
app.use('/',users);



module.exports = app;
