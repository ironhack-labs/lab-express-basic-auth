require('dotenv/config');
require('./db');
const express = require('express');
const hbs = require('hbs');
const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);
// require("./config/session.config")(app)
// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes');
app.use('/', index);

const authRoutes = require("./routes/auth.routes")
app.use("/", authRoutes)

const userRouter = require("./routes/user.routes")
app.use("/", userRouter)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

