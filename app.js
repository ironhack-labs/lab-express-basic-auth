// app.js
// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();


// Place session configuration here, right after initializing Express and before other middleware/route setups
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'superSecret', // Remember to set SESSION_SECRET in your .env
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/basic-auth' })
  })
);

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "basic-auth";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

// authRouter 
const authRouter = require('./routes/auth.routes');
app.use('/', authRouter); 

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;

