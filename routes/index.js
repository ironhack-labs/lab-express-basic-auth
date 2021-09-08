const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/userProfile", (req, res) => res.render("users/user-profile"));


module.exports = router;
