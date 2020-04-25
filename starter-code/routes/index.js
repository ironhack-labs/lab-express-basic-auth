const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      console.log("User logged in");
      next();
    } else {
      res.redirect("/login");
    }
  };
};

router.get("/main", loginCheck(), (req, res) => {
  console.log("this is the cookie: ", req.cookies);
  res.cookie("myCookie", "basic-auth");
  console.log("this is the user id: ", req.session.user._id);
  res.render("../views/main.hbs");
});

router.get("/private", loginCheck(), (req, res) => {
  console.log("this is the cookie: ", req.cookies);
  res.cookie("myCookie", "basic-auth");
  console.log("this is the user id: ", req.session.user._id);
  res.render('../views/private.hbs');
});

module.exports = router;
