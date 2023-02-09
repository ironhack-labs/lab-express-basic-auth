const router = require("express").Router();
const authRoutes = require("./auth.routes")
const mainRoutes = require("./main.routes")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// AUTH ROUTES
router.use("/auth", authRoutes)

// MAIN ROUTES
router.use("/", mainRoutes)

module.exports = router;
