const express    = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/auth/login");
    errorMessage: "Tienes que logarte para acceder"
  }
});

router.get("/home", (req, res, next) => {
  res.render("main/home");
});

module.exports = router;