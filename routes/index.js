const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/profile",isLoggedIn, (req, res, next) => {
  res.render("profile/profile",{ userInSession: req.session.currentUser })})

  router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });

module.exports = router;
