const router = require("express").Router();

const isLoginTrue = require("./../middleware/isLoginTrue");

/* GET home page */
router.get("/", (req, res, next) => {

  let userIsLoggedIn = false;
  if (req.session.user) {
    userIsLoggedIn = true;
  }
  res.render("index", { userIsLoggedIn: userIsLoggedIn });
});


module.exports = router;
