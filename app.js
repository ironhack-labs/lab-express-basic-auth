require("dotenv").config();
const path = require("path");
const express = require("express");
const createError = require("http-errors");
const logger = require("morgan");
const favicon = require("serve-favicon");

const cookieParser = require("cookie-parser");
const hbs = require("hbs");

// Set up the database
require("./configs/db.config");

// Routers
const indexRouter = require("./routes/index.routes");

const app = express();

// Configurar sessoes
// Aqui estamos usando um conceito chamado currying: uma funcao que retorna outra funcao. Podemos invocar a funcao de dentro sem atribui-la a uma variavel antes
require("./configs/session.config")(app);

// Configurar passport
require("./configs/passport.config")(app);

// Express View engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
hbs.registerPartials(__dirname + "/views/partials");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

// Routes middleware
app.use("/", indexRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => next(createError(404)));

// Catch all error handler
app.use((error, req, res) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get("env") === "development" ? error : {};

  res.status(error.status || 500);
  res.render("error");
});

module.exports = app;
