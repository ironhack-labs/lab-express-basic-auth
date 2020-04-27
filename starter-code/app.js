require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
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
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

hbs.registerPartials(path.join(__dirname, "views", "partials"));

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    secret: "iitssnootmyseecreetiisyoouurss",
    cookie: {
      maxAge: 60000,
    },
    saveUninitialized: true,
    resave: true,
  })
);

app.use(flash())
app.use((req, res, next) => {
  console.log(req.session.currentUser, "----- session logged");
  if (req.session.currentUser) {
    res.locals.isLoggedIn = true;
  } else {
    res.locals.isLoggedIn = false;
  }
  next();
});
// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
const logs = require('./routes/logs')
app.use('/', index);
app.use('/logs', logs)

module.exports = app;