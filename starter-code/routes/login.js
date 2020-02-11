const express = require("express");
var loginRouter = express.Router();
const User = require("./../models/User");


//GET /login

loginRouter.get("/", (req, res) => {
  res.render("login");
});

//POST   /login
loginRouter.post("/", )







module.exports = loginRouter;