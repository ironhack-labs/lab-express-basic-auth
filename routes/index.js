const router = require("express").Router();

// create a middleware to check if the user is logged in
const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user){
      next();
    }else{
      res.redirect('/login');
    }
  }
}


//Mine
router.get('/profile', loginCheck(), (req, res, next) => {
  console.log('this is the cookie: ', req.cookies);
  res.cookie('myCookie', 'COOKIE_YUMM');
  //res.clearCookie('myCookie')
  const loggedInUser = req.session.user;
  console.log(loggedInUser);
  res.render('profile', { user: loggedInUser});

});





/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
