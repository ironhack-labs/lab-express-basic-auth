const router = require("express").Router();
const isLoggedIn = require('./loggedin');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/welcome', isLoggedIn,  (req, res) => {
  const user = req.session.currentUser;
  res.render('welcome', user)
});

router.get('/logout', (req, res) => {
  req.session.destroy(error => {
      if(error) {
          console.log(error);
      } else {
          res.redirect('/');
      }
  });
});

module.exports = router;