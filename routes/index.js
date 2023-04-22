const router = require("express").Router();
const authRoutes = require("./auth/auth.routes");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.use("/auth", authRoutes);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/user-profile", isLoggedIn, (req, res) => {
  res.render("users/user-profile", { username: req.session.username });
});

const signup = require("./auth/auth.routes");
router.use("/auth", signup);

module.exports = router;
