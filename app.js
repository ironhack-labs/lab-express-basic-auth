require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const app = express();

// require database configuration
require("./configs/db.config");

// Middleware Setup
/* We can also set a middleware function to run for specific routes only (not for all), by using it as the second parameter of the route definition: */
/* const myMiddleware = (req, res, next) => {
   //something here
    next()
  }
  app.get('/', myMiddleware, (req, res) => res.send('Hello World!')) */

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

app.use(
  session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 1 * 60 * 60 * 1000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
    resave: true,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  if (req.session.currentUser) {
    res.locals.currentUserInfo = req.session.currentUser;
    res.locals.isUserLoggedIn = true;
  } else {
    res.locals.isUserLoggedIn = false;
  }
  next();
});
// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

const authRouter = require("./routes/auth");
app.use("/", authRouter);
const index = require("./routes/index.routes");
app.use("/", index);

module.exports = app;
