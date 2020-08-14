const express = require("express");
const router = express.Router();

/* GET main-routes page */
router.get("/", (req, res, next) => {
  res.render("main", { userLoggedIn: req.session.currentUser });
});

module.exports = router;
