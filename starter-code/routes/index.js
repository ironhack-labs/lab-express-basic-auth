const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  const user = req.session.user;

  res.render("index", {
    user: user
  });
});

// router.get("/private", (req, res) => {
//   if (req.session.user) {
//     res.render("private");
//   } else {
//     res.redirect("/login");
//   }
// });

// router.get("/main", (req, res) => {
//   if (req.session.user) {
//     res.render("main");
//   } else {
//     res.redirect("/login");
//   }
// });

module.exports = router;
