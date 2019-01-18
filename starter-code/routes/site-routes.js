const express = require('express')
const siteRoutes = express.Router()

//Home page
siteRoutes.get("/", (req, res, next) => {
    res.render('index')
});

//Middleware for protected routes
siteRoutes.use((req, res, next) => {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect("/login");
    }
});

//protected routes
siteRoutes.get("/main", (req, res, next) => {
    res.render("auth/main")
});

siteRoutes.get("/private", (req, res, next) => {
    res.render("auth/private");
});





module.exports = siteRoutes;