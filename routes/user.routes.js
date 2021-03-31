const express = require("express");
const router = express.Router();

const userAuth = require("../configs/userAuth.config");

router.get("/profile", (request, response, next) => {
  console.log("Profile access session: ", request.session);
  console.log("Current user: ", request.session.currentUser);
  response.render("user/profile", {
    userInSession: request.session.currentUser,
  });
});

router.get("/main", userAuth, (request, response, next) => {
  response.render("user/main");
});

router.get("/private", userAuth, (request, response, next) => {
  response.render("user/private");
});

module.exports = router;
