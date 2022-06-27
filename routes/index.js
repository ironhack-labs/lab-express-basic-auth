const router = require("express").Router();


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// Auth 

router.use("/", require("./auth.routes"))
router.use("/", require("./user.routes"))

module.exports = router;
