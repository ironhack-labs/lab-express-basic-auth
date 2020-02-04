require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);


const saltRounds = 10;

const plainPassword1 = "CambiaEstePassword";
const plainPassword2 = "CambiaEstePassword2";

const salt = bcrypt.genSaltSync(saltRounds);
const hash1 = bcrypt.hashSync(plainPassword1, salt);
const hash2 = bcrypt.hashSync(plainPassword2, salt);

console.log("Hash 1 -", hash1);
console.log("Hash 2 -", hash2);


mongoose
  .connect('mongodb://localhost/starter-code', { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

//Middleware para iniciar sesion en Express
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60 * 1000 }, // 60 seconds
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    resave: true,
    saveUninitialized: false,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

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



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);

const router = require('./routes/auth');
app.use('/', router);

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

module.exports = app;