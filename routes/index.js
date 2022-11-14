const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
const { isLoggedIn } = require('./../middleware/route-guard')


router.get('/private', isLoggedIn, (req, res) => {
  res.render('user/my-profile')
})

router.get('/main', isLoggedIn, (req, res) => {
  res.render('user/main')
})


module.exports = router;

