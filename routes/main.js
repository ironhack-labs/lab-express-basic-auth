const router = require("express").Router();

/* GET main page */
router.get("/main", (req, res, next) => {
  res.render("main");
});

module.exports = router;
