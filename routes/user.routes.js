const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

router.get("/:userName/profile", (request, response, next) => {
  User.findOne({ userName: request.params.userName })
    .then((user) => {
      response.render("user/profile", user);
    })
    .catch((error) => {});
});

module.exports = router;
