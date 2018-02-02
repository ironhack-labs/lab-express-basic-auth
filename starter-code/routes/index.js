const express = require("express");
const page = express.Router();

page.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = page;