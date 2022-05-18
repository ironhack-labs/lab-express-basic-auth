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

hbs.registerPartials(__dirname + "/views/partials");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// default value for title local
const projectName = "lab-express-basic-auth";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

const userToProfile = require("./middlewares/auth.middlewares");

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

// require signup route
const signup = require("./routes/signup.routes");
app.use("/auth/sign-up", signup);

// require main route
const main = require("./routes/main.routes");
app.use("/auth/main", main);

// require login route
const login = require("./routes/login.routes");
app.use("/auth/login", login);

// require logout route
const logout = require("./routes/logout.routes");
app.use("/auth/logout", logout);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
