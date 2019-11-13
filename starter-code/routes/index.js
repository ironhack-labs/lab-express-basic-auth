const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {loggedIn: req.session.user});
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next()
    } else {
      res.redirect('/');
  }
}
}


// why is this on the index.js page?
// router.get("/signup", (req, res) => {
//   res.render("signup.hbs");
// });


router.get('/profile', loginCheck(), (req, res) => {
  res.render('profile.hbs', {
    user: req.session
  })
})




module.exports = router;
