const { isLoggedIn } = require("../middleware/route-guard");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/main', isLoggedIn, (req, res, next) => {
  res.render('main')
})

module.exports = router;
