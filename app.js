// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const { isLoggedIn, isLoggedOut } = require("./middleware/route-guard");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares

require("./config/session.config")(app);
require("./config")(app);

// default value for title local
const projectName = "lab-express-basic-auth";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);
app.use("/", require("./routes/auth"));

app.use("/", isLoggedIn, require("./routes/main"));
app.use("/", isLoggedIn, require("./routes/private"));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
