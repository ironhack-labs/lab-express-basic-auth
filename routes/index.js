const { isLoggedIn } = require("../middlewares/route-guard");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// Creating logout route
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

// Creating protected views, only logged in user can enter
router.get("/main", isLoggedIn, (req, res) => {
  res.render("main");
});

router.get("/private", isLoggedIn, (req, res) => {
  res.render("private");
});

module.exports = router;
