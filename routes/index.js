const router = require("express").Router();
const isLoggedIn = require("../middlewares/loggedIn");
const isLoggedOut = require("../middlewares/loggedOut");

/* GET home page */
router.get("/",  (req, res, next) => {
  res.render("index");
});
const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);



router.get("/profile", isLoggedIn, (req, res) => {
  console.log(req.session)
  console.log(req.session.user)
  res.render("profile", { username: req.session.user.username})
})




module.exports = router;