require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

//const { isLoggedIn } = require('./utils/middleware');

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// SESSION(COOKIES) MIDDLEWARE
app.use(
  session({
    secret: "asavsuivbawibvi",
    // cookie: { maxAge: 3600000 * 1 },	// 1 hour
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24 * 7, // Time to live - 7 days (14 days - Default)
    }),
  })
);

// require database configuration
require("./configs/db.config");

// Middleware Setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

const index = require("./routes/index.routes");
app.use("/", index);

const siteRouter = require("./routes/secret-routes");
app.use("/", siteRouter);

module.exports = app;
