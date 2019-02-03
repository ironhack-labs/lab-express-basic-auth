const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("home");
  });

//protected routes
router.use("/private", (req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
  });

  router.use("/main", (req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
  });
  
router.get("/main", (req, res, next) => {
    res.render("main");
});
router.get("/private", (req, res, next) => {
    res.render("private");
});

module.exports = router;