const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

router.get("/profile", (req, res) => {
  res.render("auth/profile");
});

module.exports = router;
