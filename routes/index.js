const router = require("express").Router();



/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// Auth router
router.use("/", require("./auth.routes"))

// User router
router.use("/", require("./user.routes"))

module.exports = router;
