const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if (res.locals.user) {
    next();
  } else {
    console.log("You need to login");
    return res.redirect("/auth/login");
  }
});

router.get("/main", (req, res, next) => {
  res.render("user/main", { title: res.locals.user.firstName });
});

router.get("/private", (req, res, next) => {
  res.render("user/private", { title: res.locals.user.firstName });
});

module.exports = router;
