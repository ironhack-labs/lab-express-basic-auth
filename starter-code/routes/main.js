const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.user((req,res,next) => {
    if(req.session.currentUser) {
        next()
    } else {
        res.redirect("/login")
    }   
})

router.get("/main", (req,res,next) => {
    res.render("main")
}

module.exports = router