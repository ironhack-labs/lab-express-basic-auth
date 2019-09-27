require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const path = require("path");
const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
const mongoose = require('mongoose');
const logger = require('morgan');

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());



app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
const postsRoute = require('./routes/posts');

app.use(
  session({
    secret: "wow much secret, very secret", //encrypts cookie (so it hashes)
    cookie: {
      maxAge: 24 * 60 * 60 // 1 day
    }, // options for cookie storage
    resave: false, //don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

app.use('/', index);
app.use("/posts", postsRoute);

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));



mongoose
  .connect("mongodb://localhost:27017/dogLovers", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("I AM CONNECTED");
  })
  .catch(err => {
    console.log("Something went wrong");
  });














module.exports = app;