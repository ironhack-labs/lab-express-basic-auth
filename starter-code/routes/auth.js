const express = require("express");
const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
    console.log(req.body) // debug
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", {});
});

router.post("/login", (req, res, next) => {
    console.log(req.body) // debug
});

module.exports = router;
