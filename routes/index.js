const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// protected rputes
const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  }
}

router.get("/profile", loginCheck(), (req, res, next) => {
  
  console.log('-------- COOKIE: ', req.cookies);
  const loggedInUser = req.session.user;
  console.log('-------- USER: ', loggedInUser);
  res.render('profile', { user: loggedInUser });
});

router.get("/gif", loginCheck(), (req, res, next) => {
  res.render('gif');
});

module.exports = router;
