//.ENV
require("dotenv").config();

//Express/morgan and hbs
const hbs = require("hbs");
const express = require("express");
const logger = require("morgan");
const sessionConfig = require("./config/session.config");

//Database
require("./config/db.config");

//Express server handling requests and responses
const app = express();

//Make public available
app.use(express.static("public"));

//urlencoded é um parser das informações vindas no body da request
app.use(express.urlencoded({ extended: false }));

//log HTTP requests and errors
app.use(logger("dev"));

//sesssion config
app.use(sessionConfig);

// creates an absolute path pointing to a folder called "views"
app.set("views", __dirname + "/views");

// tell our Express app that HBS will be in charge of rendering the HTML
app.set("view engine", "hbs");

// register the partials
hbs.registerPartials(__dirname + "/views/partials");

//keep current user
app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
});

// Routes
const routes = require("./config/routes.config.js");
app.use(routes);

app.use((err, req, res, next) => {
  res.render("error", { err });
});

// Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
