const express    = require("express");
const siteRoutes = express.Router();

siteRoutes.get("/", (req, res, next) => {
  res.render("home");
});

let connectedMiddleware = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
};

siteRoutes.get ("/secret", connectedMiddleware, (req, res, next) => {
  console.log('DEBUG req.session, req.session');
  res.render("secret");
})

siteRoutes.get("/secret", (req, res, next) => {
  res.render("secret");
});

module.exports = siteRoutes;

