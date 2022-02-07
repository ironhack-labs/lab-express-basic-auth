const router = require("express").Router();

const {isLoggedIn} = require ('./../middleware/route-guards')
 

router.get("/perfil", isLoggedIn, (req, res, next) => {
  res.render("user/user", {user: req.session.currentUser});
});


// Protected Routes
router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("user/private", {user: req.session.currentUser});
});


router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("user/main", {user: req.session.currentUser});
});


module.exports = router;
