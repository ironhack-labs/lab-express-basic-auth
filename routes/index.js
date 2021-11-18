const router = require("express").Router();
const userLoggedIn = require("./../middleware/login-confirmation")

/* GET home page */
router.get("/", (req, res, next) => {
  let userLoggedIn = false;
  const userInfo = req.session.user;
  if (userInfo){
    userLoggedIn = true;
  }
  res.render("index", { userLoggedIn: userLoggedIn, userInfo });
});

router.get("/main", userLoggedIn, (req, res) => {
  let userLoggedIn = false;
  const userInfo = req.session.user;
  console.log(userInfo);
  if (userInfo){
    userLoggedIn = true;
  }
  res.render("main-page", { userLoggedIn: userLoggedIn, userInfo });
})

router.get("/private", userLoggedIn, (req, res) => {
  let userLoggedIn = false;
  const userInfo = req.session.user;
  if (userInfo){
    userLoggedIn = true;
  }
  res.render("secret-page", { userLoggedIn: userLoggedIn, userInfo });
})

module.exports = router;
