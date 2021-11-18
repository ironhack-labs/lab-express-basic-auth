const router = require("express").Router();

/* GET home page */
router.get("/signin", (req, res, next) => {
  res.render("signin");
});

module.exports = router;
