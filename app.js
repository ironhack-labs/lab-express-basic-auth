require("dotenv/config");
require("./db");

const express = require("express");
const hbs = require("hbs");
const bcrypt = require("bcrypt")
const app = express();
const User = require('./models/User.model')

require("./config")(app);

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('./db/index');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
)

const projectName = "node-basic-auth";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with Ironlauncher`;

const index = require('./routes/index.routes');
app.use('/', index);

const login = require('./routes/login');
app.use('/', login);

const signup = require('./routes/signup');
app.use('/', signup);

const social = require('./routes/passAuth');
app.use('/', social);

module.exports = app;