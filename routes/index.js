const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//public page
router.get("/public", (req, res, next) => {
  res.render("public")
})
module.exports = router;
