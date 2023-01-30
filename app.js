const express = require('express');
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const path = require("path");
const { sessionConfig, loggedUser } = require('./config/session.config');

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

//Session Middleware
app.use(sessionConfig);
app.use(loggedUser);

// 👇 Routes here
const index = require('./routes/index.routes');
app.use('/', index);

const auth = require('./routes/auth.routes');
app.use('/auth', auth);

const user = require('./routes/user.routes');
app.use('/user', user);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

