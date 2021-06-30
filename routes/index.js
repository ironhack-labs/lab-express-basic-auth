const router = require("express").Router();

// create a middleware to check if the user is logged in
const loginCheck = () => {
  return (req, res, next) => {
    // is there a logged in user
    if (req.session.user) {
      // proceed as intended
      console.log('logged username: ' + req.session.user.username)
      next();
    } else {
      // there is no user logged in
      // we redirect to /login
      res.redirect('/login');
    }
  }
}

/* GET home page */
router.get("/", (req, res, next) => {
  res.render('index', { title: 'Home' });
});

router.get('/profile', loginCheck(), (req, res, next) => {
  // this is how you access a cookie
  console.log('this is the cookie: ', req.cookies);
  // this is how you can set a cookie
  // res.cookie('myCookie', 'hello world');
  // this is how you delete a cookie
  // res.clearCookie('myCookie');
  const loggedInUser = req.session.user;
  res.render('profile', { user: loggedInUser, title: loggedInUser.username + "'s profile" });
});

module.exports = router;
