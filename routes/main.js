const router = require("express").Router();

function requireLogin(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get("/main", requireLogin, (req, res, next) => {
  res.render("main");
});

module.exports = router;
