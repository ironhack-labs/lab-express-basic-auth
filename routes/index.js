const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")

/* GET home page */
router.get("/", (req, res, next) => {
  console.log(req.session)
  if (req.session.count) {
    req.session.count += 1
  } else {
    req.session.count = 1
  }

  console.log(req.session.count)
  res.render("index")
})

router.get("/main", function (req, res, next) {
  res.render("main");
});

// router.use((req, res, next) => {
//   if (req.session.currentUser) {
//     next();
//   } else {
//     res.redirect("/login");
//   }
// });

router.get("/private", function (req, res, next) {
  res.render("private");
});

module.exports = router