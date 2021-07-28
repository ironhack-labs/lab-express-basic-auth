// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');
// ℹ️ This function is getting exported from the config folder. It runs most middlewares


// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');
const session = require("express-session");

const index = require('./routes/index');
const usersRouter = require('./routes/users');
const User = require("./models/User.model");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();
require('./config')(app);


// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here


app.use('/', index);
app.use("/users", usersRouter);
app.use("/auth", require("./routes/auth"));


app.use (
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
	})
);

app.use((req, res, next) => {
	if (req.session.currentUser) {
		User.findbyId(req.session.currentUser._id)
			.then((userFromDb) => {
				res.locals.currentUser = userFromDb;
				res.locals.isLoggedIn = true;
				next();
			})

			.catch((error) => {
				next(error);
			});
	} else {
		res.locals.currentUser = underfined;
		res.locals.isLoggedIn = false;
		next();
	}
});

app.use ((req, res, next) => {
	console.log(req.session);
	next();
});




// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

