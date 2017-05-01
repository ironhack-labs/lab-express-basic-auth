const express = require("express");
const siteRoutes = express.Router();

const auth= require('../helper/auth');

siteRoutes.get("/main",auth.checkLoggedIn("/login"), (req, res, next) => {
  res.render("main");
});

siteRoutes.get("/", (req, res, next)=>{
  res.render("index");
});

siteRoutes.get("/private",auth.checkLoggedIn("/login"), (req, res, next)=>{
res.render("private");
});



// siteRoutes.get("/", (req, res, next)=>{
//   res.render("index");
// });
















module.exports = siteRoutes;
