const router = require("express").Router();
const { isLoggedIn } = require("../middleware/loginCheck");

router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main/main");
});

module.exports = router;
