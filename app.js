const express = require('express');
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const path = require("path");

require('dotenv/config');
require('./config/db.config');
require('./config/hbs.config');

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.set("views", path.join(__dirname, ".", "views"));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, ".", "public")));
app.use(favicon(path.join(__dirname, ".", "public", "images", "favicon.ico")));

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Routes here
const index = require('./routes/index');
app.use('/', index);

const user = require('./routes/user');
app.use('/user', user);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

