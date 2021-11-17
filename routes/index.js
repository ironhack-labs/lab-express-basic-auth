const router = require("express").Router();

function isLoggedIn(req, res, next){
  if (!req.session.user){
    return res.redirect('/login')
  } 

  next();
}

/* GET home page */
router.get("/", (req, res, next) => {
  const user = req.session.user;
  console.log(user);
  res.render("index");
});

router.get('/main', isLoggedIn, (req, res) => {
  res.render('main-picture');


});

module.exports = router;
