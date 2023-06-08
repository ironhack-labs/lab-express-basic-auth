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

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);
require('./config/session.config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// app.use("/login", (req, res, next) => {
//     console.log("Middleware catching!!!!!!");
//     next();
// });
app.use(['/main', '/private'], (req, res, next) => {
    console.log("Middleware session", req.session);
    app.locals.session = req.session; // allow access to session data from layout.hbs
    
    if (req.session.currentUser) {
        next();
    } else {
        console.log("Not loggued in");
        res.sendStatus(403).redirect("/login");
    }
  });

// 👇 Start handling routes here
app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth.routes'));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

