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

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);
require("./config/session.config")(app)


// default value for title local
const projectName = "lab-express-basic-auth";
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth.routes");
const privateRoutes = require ("./routes/private.routes");
const mainRoutes = require ("./routes/main.routes")
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/private", privateRoutes);
app.use("/main", mainRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
