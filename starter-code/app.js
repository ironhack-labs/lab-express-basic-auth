const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();


const index = require('./routes/index');
const authController = require('./routes/authController');
// Controllers

// Mongoose configuration
mongoose.connect("mongodb://localhost/basic-auth");

// Middlewares configuration
app.use(logger("dev"));

// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayouts);
app.set('layout', 'layout/main-layout');

// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Authentication
app.use(cookieParser());
app.use(session({
	secret: "auth-super-secret",
	cookie: { maxAge: 60000 },
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		ttl: 24 * 60 * 60
	})
}));


// Routes
app.use('/', index);
app.use('/', authController);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
