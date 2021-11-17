const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


// middleware to protect a route
const loginCheck = () => {
  return (req, res, next) => {
    // check for a logged in user
    if (req.session.user) {
      next()
    } else {
      res.redirect('/login')
    }
  }
}


router.get("/profile", loginCheck(), (req, res, next) => {
  // this is how we can set a cookie
  res.cookie('ourCookie', 'hello node')
  console.log('this is our cookie: ', req.cookies)
  // to clear a cookie
  res.clearCookie('ourCookie');
  // we retrieve the logged in user from the session
  const loggedInUser = req.session.user
  res.render("profile", { user: loggedInUser });
});



module.exports = router;
