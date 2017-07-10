/*jshint esversion: 6 */

const express    = require("express");
const siteRoutes = express.Router();

siteRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

siteRoutes.get("/secret", (req, res, next) => {
  res.render("secret");
});

siteRoutes.get("/", (req, res, next) => {
  res.render("index");
});

siteRoutes.get("/logout",(req,res,next) =>{
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});

module.exports = siteRoutes;
