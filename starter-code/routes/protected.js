const express = require("express");
const app = express()


app.get("/main", (req, res, next) => {
  res.render("protected/main.hbs", {
    currentUser: req.session.currentUser
  });
});

app.get("/private", (req, res, next) => {
  res.render("protected/private.hbs", {
    currentUser: req.session.currentUser
  });
});

module.exports = app;