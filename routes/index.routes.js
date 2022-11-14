const express = require('express');
const router = require("express").Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10

const { isLoggedIn } = require('./../middleware/route.guards');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/mi-perfil", isLoggedIn, (req, res, next) => {
  res.render("user/profile", { user: req.session.currentUser })
})

module.exports = router;
