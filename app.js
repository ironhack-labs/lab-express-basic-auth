// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');
const logger = require('morgan');
const createError = require('http-errors');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();
app.use(logger('dev')); // logger de morgan para ver las peticiones que se hacen
app.use(express.json()); // para que el body de las peticiones se pueda leer y ver en terminal
app.use(express.urlencoded({ extended: true })); // para que el body de las peticiones se pueda leer

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);
require('./config/hbs.config');
const router = require('./config/routes.config');

app.use('/', router)

//* Error Middlewares

app.use((req, res, next) => {
 next(createError(404, 'Page not found'));
});


app.use((error, req, res, next) => {
    console.log(error)
    let status =  error.status || 500;
  
    res.status(status).render('error', {
      message: error.message,
      error: req.app.get('env') === 'development' ? error : {}
    })
  })

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

