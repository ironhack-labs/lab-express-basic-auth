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

//in order to set the navbar in a partial folder:
hbs.registerPartials(__dirname + "/views/partials")
const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

const exposeUsers = require('./middlewares/exposeUsersToViews');

//app.use(exposeUsers)

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', exposeUsers, index);
// app.use("/", require("./routes/auth.routes"));
// app.use("/profile", require("./routes/profile.routes"));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

