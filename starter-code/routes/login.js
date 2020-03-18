const express = require("express");
const router = express.Router();  
const User = require("../models/User");
const bcrypt = require('bcrypt');
// const session    = require("express-session");
// const MongoStore = require("connect-mongo")(session);

router.get("/", (req,res)=> {
    res.render("user/login");
})

router.post("/", (req,res,next)=> {
    const {username, password} = req.body; 
    User.findOne({
        username 
    })
    .then((user)=> {
        if(!user) res.send("invalid credentials.")
        else {
            bcrypt.compare(password, user.password, function(err, correctPassword) {
                if(err) next("hash compare error");
                else if(!correctPassword) res.send("invalid credentials.");
                else {
                    req.session.currentUser = user;
                    res.redirect("/profile");
                }
            });
        }
    })
    .catch((err)=> {
        res.send("Error, not logged in.")
    })
})

module.exports = router;