const { isLoggedIn } = require("../middleware/route-guard");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/main', isLoggedIn, (req, res) => {
  res.render('main')
})

router.get('/private', isLoggedIn, (req, res) => {
  res.render('private')
})

module.exports = router;
