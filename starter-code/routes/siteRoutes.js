const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.render("../views/unloged.hbs");
  }
});

router.get("/secret", (req, res, next) => {
  res.render("secret");
});


module.exports = router;
