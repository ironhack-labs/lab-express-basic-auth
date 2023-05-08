// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

const express = require('express');

const hbs = require('hbs');

const app = express();

require('./config')(app);
require("./config/session.config")(app)

const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

const index = require('./routes/index');
app.use('/', index);

const authRoutes = require("./routes/auth.routes")
app.use("/", authRoutes)

const userRouter = require("./routes/user.routes")
app.use("/", userRouter)

const galleryRoutes = require("./routes/gallery.routes")
app.use("/", galleryRoutes)


require('./error-handling')(app);

module.exports = app;

