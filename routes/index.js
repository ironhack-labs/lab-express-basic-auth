const router = require("express").Router();
const userLoggedIn = require("./../middleware/login-confirmation")

/* GET home page */
router.get("/", (req, res, next) => {
  let userLoggedIn = false;
  if (req.session.user){
    userLoggedIn = true;
  }
  res.render("index", { userLoggedIn: userLoggedIn });
});

router.get("/main", userLoggedIn, (req, res) => {
  let userLoggedIn = false;
  if (req.session.user){
    userLoggedIn = true;
  }
  res.render("main-page", { userLoggedIn: userLoggedIn });
})

router.get("/private", userLoggedIn, (req, res) => {
  let userLoggedIn = false;
  if (req.session.user){
    userLoggedIn = true;
  }
  res.render("secret-page", { userLoggedIn: userLoggedIn });
})

module.exports = router;
