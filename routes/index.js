const router = require("express").Router();
const isLoggedIn = require("./../middleware/isLoggedIn");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//GET /private

router.get("/private", isLoggedIn, (req, res) => {
  res.render("private");
})


router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main");
})
module.exports = router;


