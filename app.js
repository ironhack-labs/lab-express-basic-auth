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
//Importar la sesion
const sessionManager = require("./config/session");

// default value for title local
const projectName = "lab-express-basic-auth";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

//Middlewares
//ejecutamos sessionManager y pasamos como argumento la instancia de express:app
sessionManager(app);
//layaout middlewares: Forma parte de los middlewaresde ruta
app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
});
// 👇 Start handling routes here

const index = require("./routes/index");
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/", index);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
