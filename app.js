// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');
const app = express();
require('./config/session.config')(app);
require("./config")(app);



// ℹ️ This function is getting exported from the config folder. It runs most middlewares

// require('./config/session.config')(app)

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const indexRoutes = require('./routes/index.routes');
app.use('/', indexRoutes);

const authRouter = require('./routes/auth.routes.js'); 
app.use('/',authRouter)

// const path = require('path');
// app.use(express.urlencoded({ extended: true }));
// app.use('/',require('./routes/auth.routes') );
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'views'));
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

