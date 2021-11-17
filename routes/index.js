const router = require("express").Router();
const isLoggedIn = require("./../middleware/isLoggedIn")

/* GET home page */
router.get("/", (req, res, next) => {
  const user = req.session.user;
  console.log(user);
  res.render("index", {user});
});

/* GET /main */
router.get("/main", isLoggedIn, (req, res) => {
  res.render("main");
});

/* GET /private */
router.get("/private", isLoggedIn, (req, res) => {
  res.render("private");
});

module.exports = router;
