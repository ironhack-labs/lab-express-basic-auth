const router = require("express").Router();

// middleware to check if the user is logged in
const loginCheck = () => {
  return (req, res, next) => {
    
    // if user is logged in proceed to the next step
    if (req.session.user) {
      next();
    } else {
      
      // otherwise redirect to /login
      res.redirect('/login');
    }
  }
}

/* home page */
router.get("/", (req, res, next) => {
  const user = req.session.user;
  res.render("index", { user: user });
});

// protected route - can only be accessed by a logged in user
router.get('/profile', loginCheck(), (req, res) => {
  res.render('profile');
})

module.exports = router;
