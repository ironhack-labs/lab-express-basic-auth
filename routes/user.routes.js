const express = require("express");
const userRouter = express.Router();
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/IsLoggedIn.middleware");

userRouter.get("/personal", isLoggedIn, (req, res) => {
  res.render("user/personal");
});

userRouter.get("/:id", isLoggedIn, (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      const { username } = user;
      res.render("user/personal", { username });
    })
    .catch((err) => {
      console.log(
        `Oopsie there went something wrong with loading your personal page${err}`
      );
    });
});

module.exports = userRouter;
