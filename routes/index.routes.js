const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/route-guard")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
