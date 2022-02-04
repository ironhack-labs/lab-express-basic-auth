// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./config/db.config.js');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ Middlewares

// ℹ️ Responsible for the messages you see in the terminal as requests are coming in
// https://www.npmjs.com/package/morgan
const logger = require("morgan");

// ℹ️ Needed when we deal with cookies (we will when dealing with authentication)
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require("cookie-parser");

// ℹ️ Serves a custom favicon on each request
// https://www.npmjs.com/package/serve-favicon
const favicon = require("serve-favicon");

// Middleware configuration

// In development environment the app logs
app.use(logger("dev"));
// To have access to `body` property in the request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Normalizes the path to the views folder
app.set("views", (__dirname, "..", "views"));
// Sets the view engine to handlebars
app.set("view engine", "hbs");
// Handles access to the public folder
app.use(express.static((__dirname, "..", "public")));


// 👇 Start handling routes here
const routes = require('./config/routes.config.js');
app.use('/', routes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
app.use((req, res, next) => res.status(404).render('not-found'));

app.use((err, req, res, next) => {
  console.error('ERROR', req.method, req.path, err);
  if (!res.headersSent) {
    res.status(500).render('error');
  }
});

// Connecting to server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});

module.exports = app;