const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/private", (req, res, next) => {
  res.render("private");
});

// create a middleware to check if the user is logged in
const loginCheck = () => {
  return (req, res, next) => {
    // is there a logged in user?
    if(req.session.user) {
      // if yes -> proceed as requested
      next();
    } else {
      // if there is no logged in user -> redirect to login
      res.redirect('/private');
    }
  }
}

// this route is now protected -> can only be accessed by a logged in user
router.get("/main", loginCheck(), (req, res, next) => {
  const loggedInUser = req.session.user;
  res.render("main", {user: loggedInUser});
});

module.exports = router;
