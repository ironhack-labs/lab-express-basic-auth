const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

function requireLogin(req, res, next){
    if (req.session.currentUser){
        next()
    }
    else {
        res.redirect("/login")
    }
}


router.get("/signup", (req, res)=>{
    res.render("auth/signup")
})

router.post("/signup", async (req, res)=>{
    const {username, image, password} = req.body
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await User.create({username, image, password:hashedPassword})

    res.redirect("/")
})

router.get("/login", (req, res) => {
    res.render("auth/login");
  });

router.post("/login", async (req, res)=>{
    const {username, password} = req.body
    if (!username || !password){
        res.render("auth/login", {errorMessage: "Fill username and password"})
        return
    }
    const user = await User.findOne({username})
    if (!user){
        res.render("auth/login", {
            errorMessage: `${username} does not exist`
        })
        return
    }
    if (bcrypt.compareSync(password, user.password)){
        req.session.currentUser = user
        res.redirect("/private")
    } else {
        res.render("auth/login", {
            errorMessage: `${username} does not exist`
        })
    }
    res.render("auth/private")
})

router.get("/main", (req, res)=>{
    res.render("auth/main")
})

router.get("/private", requireLogin, (req, res)=>{
    res.render("auth/private")
})

router.post("/logout", (req, res)=>{
    req.session.destroy()
    res.redirect("/")
})

router.get("/:userId", async (req, res)=>{
    const userDetail = await User.findById(req.params.userId)
    res.render("auth/user-detail", userDetail)
})
//console.log(req.session.currentUser._id) //O id 
module.exports = router