const router = require("express").Router();
const { isLoggedIn } = require('./../middeleware/route-guard')
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


//mi perfil
router.get('/mi-perfil', isLoggedIn, (req, res, next) => {
  res.render("user/profile", { user: req.session.currentUser })
})


//my main page
router.get('/main', isLoggedIn, (req, res, next) => {
  res.render("user/main", { user: req.session.currentUser })
})

//my main page

router.get('/private', isLoggedIn, (req, res, next) => {
  res.render("user/private", { user: req.session.currentUser })
})
module.exports = router;
