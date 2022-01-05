const router = require("express").Router();
// const isLoggedIn = require('../middleware/isLoggedIn')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
