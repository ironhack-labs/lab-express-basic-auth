require('dotenv/config');​
module.exports = app;

/* //require('dotenv/config');
require("./db");
​
// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
​
// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");
​
const app = express();
​
// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
​
// session configuration
​
const session = require('express-session');
const MongoStore = require('connect-mongo');
const DB_URL = process.env.ATLAS_CONNECTION;
​
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		// for how long is a user automatically logged in 
		cookie: { maxAge: 1000 * 60 * 60 * 24 },
		saveUninitialized: false,
		resave: true,
		store: MongoStore.create({
			mongoUrl: DB_URL
		})
	})
)
​
// end of session configuration
​
// default value for title local
const projectName = "node-basic-auth";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();
​
app.locals.title = `${capitalized(projectName)} created with IronLauncher`;
​
// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);
​
const auth = require("./routes/auth");
app.use("/", auth);
​
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);
​
module.exports = app; */