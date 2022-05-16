const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  console.log(req.session);
  res.render("index");
});

router.use("/", require("./auth.routes"));

module.exports = router;
