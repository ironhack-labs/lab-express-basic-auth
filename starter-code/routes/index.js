const express = require("express");
const router = express.Router();
const User = require("../models/user").User;

router.get("/", (req, res, next) => {
  const data = {
    username: req.session.currentUser,
    title: "homepage"
  };
  console.log(data);
  res.render("index", data);
});

module.exports = router;
