const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  //console.log(req.session.user);
  res.render("index", { user: req.session.user });
});

//保護されたルート×２
router.get("/main", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  } else {
    res.render("main.hbs");
  }
});

router.get("/private", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  } else {
    res.render("private.hbs");
  }
});

/* router.get("/main", (req, res) => {
  res.render("main.hbs");
});

router.get("/private", (req, res) => {
  res.render("private.hbs");
});
 */
module.exports = router;
