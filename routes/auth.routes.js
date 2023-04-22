const bcrptjs = require("bcryptjs")
const User = require("../models/User.model")
const saltRounds = 12

const express = require("express")
const router = express.Router()
const isLoggedOut = require("../middlewares/isLoggedOut")

router.get("/signup",(req,res) =>{
    res.render("auth/signup")
})

router.post("/signup",async(req,res)=>{
    console.log(req.body)
    res.send("sign up succesfully")
    const salt = await bcrptjs.genSalt(saltRounds);
    const hash = await bcrptjs.hash(req.body.password, salt);
    const user = new User({username: req.body.username, password: hash})
    await user.save();
})

router.post("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect("/");
    });
  });

  router.get("/login",isLoggedOut,(req,res) =>{
    res.render("auth/login")
  })

  router.post("/login",async(req,res,next)=>{
    try{
        const user =await User.findOne({username:req.body.username});
        console.log("req.body",req.body)
        console.log("HERE!",user);
        if(!user){
            return res.render("auth/login",{error:"User does not existent"});
        }
        const passwordsMatch = await bcrptjs.compare(
            req.body.password,user.password
        )
        if(!passwordsMatch){
            return res.render("auth/login",{error:"the password does not existent"});
        }

        req.session.user ={
            email: user.username
        };
        
        res.redirect("/profile")

    }
    catch(err){next(err)}
  })
module.exports = router;
// const router = require("express").Router();

// router.get("/signup", (req, res, next) => {
//   res.render("auth/signup");
// });

// router.post("/signup", async (req, res) => {
//   console.log("Hello!!!");
// const router = require("express").Router();})

// module.exports = router;