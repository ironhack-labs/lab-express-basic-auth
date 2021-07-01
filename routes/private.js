const router = require("express").Router();
//middleware to make it private

function requireLogin(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get("/private", requireLogin, (req, res, next) => {
  console.log(req.session.currentUser);
  console.log("inside get");

  res.render("private");
});

module.exports = router;
