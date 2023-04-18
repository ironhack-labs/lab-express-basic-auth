const bcrptjs = require("bcryptjs")
const User = require("../models/User.model")
const saltRounds = 12

const express = require("express")
const router = express.Router()

router.get("/signup",(req,res) =>{
    res.render("auth/signup")
})

router.post("/signup",async(req,res)=>{
    console.log(req.body)
    res.send("sign up succesfully")
    const salt = await bcrptjs.genSalt(saltRounds);
    const hash = await bcrptjs.hash(req.body.password, salt);
    const user = new User({username: req.body.email, password: hash})
    await user.save();
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