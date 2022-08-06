require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const hbs = require("hbs");
const sessionConfig = require("./config/session.config")

require("./config/db.config");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));

app.use(sessionConfig);

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

hbs.registerPartials(__dirname + "/views/partials");

app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser  
  next()
})

const routes = require("./config/routes.config");
app.use(routes);

app.use((err, req, res, next) => {
  res.render("error", { err });
});

app.listen(3000, () => console.log("Listening on port 3000 👍"));

