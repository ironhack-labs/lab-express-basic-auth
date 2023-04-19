const router = require("express").Router();
const { isLoggedIn } = require("../middleware/route-guard")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* User profile page */
router.get("/profile", isLoggedIn, (req, res) => {
  const user = req.session.userisLoggedIn
  res.render("profile", { user: user })
})

/* Main page */
router.get("/main", isLoggedIn, (req, res) => {
  res.render("main")
})

/* Private page */
router.get("/private", isLoggedIn, (req, res) => {
  res.render("private")
})



module.exports = router;
