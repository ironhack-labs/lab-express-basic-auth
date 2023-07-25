
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

require('./db');


// https://www.npmjs.com/package/express
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');


// https://www.npmjs.com/package/hbs
const hbs = require('hbs');
const session = require('express-session');


const app = express();

require('./config')(app);


const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;


const index = require('./routes/index');
app.use('/', index);

const userRoutes = require('./routes/auth.routes');
app.use('/users', userRoutes);

const { Router } = require('express');
const router = new Router();



require('./error-handling')(app);

module.exports = app;

