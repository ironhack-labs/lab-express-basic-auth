const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs=require("bcryptjs")
const saltRounds = 12;
/////////ROUTES
//get signup
router.get("/signup", (req,res,next)=>{
    res.render("auth/signup")
})
//post signup
router.post("/signup",(res,req,next)=>{
    const {username, password}=req.body

    
  if (!username || !password) {
    res.render("/auth/signup", { errorMessage: "All fields are required" });
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt)=>{
        return bcrypt.hash(password, salt)
    })
    .then ((newPassword)=>{
        return User.create({
            username, password: newPassword,
        })
    })
    .then((user)=>{
        res.redirect("/auth/profile/${user._id}")
    })
    .catch(error=>{
        console.log(error)
        next()
    })


//exports
module.exports=router;