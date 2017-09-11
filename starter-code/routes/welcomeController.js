const express          = require("express");
const welcomeController = express.Router();

welcomeController.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

welcomeController.get("/", (req, res, next) => {
  res.render(
    "welcome/welcome",
    { username: req.session.currentUser.username}
  );
});

module.exports = welcomeController;
