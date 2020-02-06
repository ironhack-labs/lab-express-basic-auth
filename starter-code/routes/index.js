const express = require("express");
const router = express.Router();

function protectRoute(req, res, next) {
  if (req.session.currentUser) next();
  else res.redirect("/auth/login");
}

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// router.use((req, res, next) => {
//   if (req.session.currentUser) {
//     next();
//   } else {
//     res.redirect("/auth/login");
//   }
// });

router.get("/main", protectRoute, (req, res, next) => {
  res.render("main")
})

router.get("/private", protectRoute, (req, res, next) => {
  res.render("private");
});

module.exports = router;
