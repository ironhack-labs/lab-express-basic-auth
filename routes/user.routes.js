const express = require("express");
const userRouter = express.Router();

/* GET home page */
userRouter.get("/user/dashboard", (req, res, next) => {
  res.render("user/dashboard", { user: req.session.currentUser });
});

module.exports = userRouter;