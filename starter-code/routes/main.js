const express = require('express');
const mainRouter  = express.Router();

mainRouter.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("auth/login");
  }
})

mainRouter.get("/", (req, res) => {
  res.render("main");
})

module.exports = mainRouter;