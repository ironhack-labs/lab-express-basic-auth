const express = require('express');
const router = express.Router();

/* HOME PAGE */

router.get("/", (req, res, next) => {
  const user = req.session.user;
  res.render("index", { user: user });
});

const loginCheck = () => {
  return (req, res, next) => {

    if (req.session.currentUser) {
      // if logged in
      next();
    } else {
      // if not logged in
      res.redirect("/login");
    }
  };
};

router.get("/private", loginCheck(), (req, res) => {
  res.render("private");
});

router.get("/main", loginCheck(), (req, res) => {
  res.render("main");
});

// router.get("/main", (req, res) => {
//   console.log(req.session);
//   if (req.session.user) {
//     res.render("main");
//   } else {
//     res.redirect("/login");
//   }
// });

// router.get("/private", (req, res) => {
//   if (req.session.user) {
//     res.render("private");
//   } else {
//     res.redirect("/login");
//   }
// });


module.exports = router;
