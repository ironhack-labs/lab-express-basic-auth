const { Router } = require("express");
const router = Router();
const {signIn, logIn} = require("../controllers/auth.controller")

router
  .get("/", (req, res) => {
    res.render("index");
  })
  .get("/signIn", (req, res) => {
    res.render("signIn");
  })
  .get("/logIn", (req, res) => {
    res.render("logIn");
  })
  .post("/newUser", signIn)
  .post("/loginData", logIn)
  
  
  
  
  
  module.exports = router;
