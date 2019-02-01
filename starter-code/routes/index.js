const express = require("express");
const router = express.Router();
const User = require("../models/user-schema");
const bcrypt = require("bcrypt");
// const bcrypt = 10;

//SOLO RUTAS GET,POST,PUT....
/* GET home page */
router.get("/pepe", (req, res, next) => {
  res.render("index");
});

module.exports = router;
