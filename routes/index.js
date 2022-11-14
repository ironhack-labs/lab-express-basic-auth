const router = require("express").Router();
const express = require('express')


router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", (req, res, next) => {
  res.render("user/profile", { user: req.session.currentUser })
})

router.get("/private", (req, res, next) => {
  res.render("user/private", { user: req.session.currentUser })
})



module.exports = router;

