const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

router.get("/profile", (request, response, next) => {
  console.log("Profile access session: ", request.session);
  console.log("Current user: ", request.session.currentUser);
  response.render("user/profile", {
    userInSession: request.session.currentUser,
  });
});

module.exports = router;
