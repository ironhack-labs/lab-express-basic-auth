const router = require("express").Router();
const isLoggedIn = require("../middlewares/loggedIn");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);



router.get("/profile", isLoggedIn, (req, res) => {
  console.log(req.session)
  console.log(req.session.user)
  res.render("profile", { username: req.session.user.username})
})

router.get("/main", isLoggedIn, (req, res) => {
  res.render("main")
})

router.get("/private")


module.exports = router;