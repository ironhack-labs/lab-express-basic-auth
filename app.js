
require('dotenv/config');


require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();



// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);
require("./config/session.config")(app)


// default value for title local
const projectName = 'Basic Auth';

app.locals.appTitle = `${projectName}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const authRouter = require("./routes/auth.routes")
app.use("/", authRouter)

const usersRouter = require("./routes/user.routes")
app.use("/", usersRouter)


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

