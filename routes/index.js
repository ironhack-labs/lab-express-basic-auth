const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//why not in auth.js?
router.get("/profile", (req, res) => {
  res.render("auth/profile");
});

module.exports = router;
