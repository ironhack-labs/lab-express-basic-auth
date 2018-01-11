const express       = require("express");
const siteRoutes    = express.Router();

siteRoutes.get("/", (req, res, next) => {
    res.render("home");
});

// Prevents users who are not logged in from accessing our
// "private" page.
siteRoutes.use((req, res, next) => {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect("/login");
    }
});

siteRoutes.get("/private", (req, res, next) => {
    res.render("private");
});

siteRoutes.get("/main", (req, res, next) => {
    res.render("main");
});

module.exports = siteRoutes;