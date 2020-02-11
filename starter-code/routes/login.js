const express = require("express");
var loginRouter = express.Router();
const User = require("./../models/User");


//GET /login

loginRouter.get("/", (req, res) => {
  res.render("login");
});

//POST   /login
loginRouter.post("/", (req, res) => {
  const { username, password } = req.body;

  if(password === "" || username === "") {
    res.render("login", {
      errorMessage: "Username and Password are required"
    });
    return;
  }
});







module.exports = loginRouter;