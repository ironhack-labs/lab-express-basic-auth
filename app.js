require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const
  session    = require(`express-session`),
  MongoStore = require(`connect-mongo`)(session)
;


mongoose
  .connect('mongodb://localhost/security', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Session
app.use(session({
  secret: `pp-basic-auth`,
  cookie: { maxAge: 600000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  }),
  resave: true,
  saveUninitialized: true
}));

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

hbs.registerPartials(`${__dirname}/views/partials`);

const
  siteRoutes = require('./routes/siteRoutes'),
  authRoutes = require(`./routes/authRoutes`)
;
app
  .use(`/`, authRoutes)
  .use(`/`, siteRoutes)
;


module.exports = app;
