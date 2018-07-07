const express    = require("express");
const siteRoutes = express.Router();

siteRoutes.get("/", (req,res,next) => {
    res.render("home");
})

siteRoutes.get("/main", (req,res,next) => {
    res.render("main");
})

siteRoutes.use((req,res,next) =>{
    if(req.session.currentUser){
        next();
    } else {
        res.redirect("/main")
    }
})

siteRoutes.get("/private", (req,res,next) => {
    res.render("private");
})



module.exports = siteRoutes;