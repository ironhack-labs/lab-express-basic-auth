require('dotenv/config');

require('./db');

const express = require('express');


const hbs = require('hbs');
const User = require('./models/User.model');

const app = express();

require('./config')(app);
require('./config/session.config')(app)

const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

const index = require('./routes/index');
app.use('/', index);

const authRouter = require('./routes/auth.routes')
app.use('/', authRouter)

const usersRouter = require('./routes/users.routes')
app.use('/', usersRouter)




require('./error-handling')(app);

module.exports = app;

