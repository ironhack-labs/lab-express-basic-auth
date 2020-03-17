const express = require("express");
const app = express()

/* GET home page */
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get("/main", (req, res, next) => {
  res.render("protected/main.hbs");
});

app.get("/private", (req, res, next) => {
  res.render("protected/private.hbs");
});

module.exports = app;