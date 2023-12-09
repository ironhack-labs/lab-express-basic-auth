require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const logger = require("morgan");

require("./config/db.config"); // es como si pusieramos todas las lineas del db.confgi aquí, pero somos mejores que eso.

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

hbs.registerPartials(__dirname + "/views/partials");

const { sessionConfig } = require("./config/session.config");
app.use(sessionConfig);
app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
});

const router = require("./router/router");
app.use("/", router);

// Middleware to handle errors.
app.use((err, req, res, next) => {
  console.error(err);

  if (err.status === 404) {
    res.render("error", { name: err.message });
  } else {
    res.render("error");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App running at port ${port} 🚀🚀`));
