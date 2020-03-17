const express = require("express");
const app = express()


app.get("/main", (req, res, next) => {
  res.render("protected/main.hbs");
});

app.get("/private", (req, res, next) => {
  res.render("protected/private.hbs");
});

module.exports = app;