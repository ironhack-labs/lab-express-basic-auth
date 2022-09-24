const router = require("express").Router();
const { isLoggedIn } = require("../middleware/loginCheck");

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private/private");
});

module.exports = router;
