const express = require("express");
const Router = express.Router();

Router.get("/", (req, res, next) => res.render("home"));

Router.use((req, res, next) => {
    if (req.session.currentUser) {
      next()
    } else {                       
      res.redirect("/login");     
    }                             
  })                              
  Router.get("/main", (req, res, next) => res.render("main"))
  
  
  Router.use((req, res, next) => {
    if (req.session.currentUser) {
      next()
    } else {                       
      res.redirect("/login");     
    }                             
  })                              
  Router.get("/private", (req, res, next) => res.render("private"))
  

module.exports = Router;