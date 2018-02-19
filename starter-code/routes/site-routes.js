const express    = require("express");
const siteRoutes = express.Router();



// route to handle home page
siteRoutes.get("/", (req, res, next) => {
  res.render("home");
});

//middleware to protect secret page
siteRoutes.use((req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
  });

  // route to handle secret page
  siteRoutes.get("/secret", (req, res, next) => {
    res.render("secret");
  });

module.exports = siteRoutes;