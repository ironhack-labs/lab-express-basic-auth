const { isLoggedIn } = require("../middleware/route-guard");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get('/my-profile', isLoggedIn, (req, res) => {
  res.render('user/profile', { user: req.session.currentUser })
})
router.get('/my-profile-main', isLoggedIn, (req, res) => {
  res.render("main", { user: req.session.currentUser })
})



module.exports = router;
