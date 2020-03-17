const express = require("express");
const app = express()

/* GET home page */
app.get('/', (req, res, next) => {
  res.render("index", {
    currentUser: req.session.currentUser
  });
});

module.exports = app;

