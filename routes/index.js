const router = require("express").Router();
const isLoggedIn = require("./../middleware/isLoggedIn");

/* GET home page */
router.get("/", (req, res, next) => {
    let userIsLoggedIn = false;
    if (req.session.user) {
      userIsLoggedIn = true;
    }
  
    res.render("index", { userIsLoggedIn: userIsLoggedIn });
});

router.get("/main", isLoggedIn, (req, res) => {
  res.render("main-view");
});

router.get("/private", isLoggedIn, (req, res) => {
  res.render("private-view");
});

module.exports = router;
