const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);





// signup route
router.get("/signup", (req,res)=>{
    res.render("signup_form", {error:null})
});

router.post("/signup", (req,res)=>{
    console.log("hola");
if(req.body.userName == null || req.body.password == null || req.body.password2 == null){
    return res.render("signup_form", {error:"Error, fields cannot be empty!"})
};
if(req.body.password !== req.body.password2){
    return res.render("signup_form", {error:"Password incorrect"})
};
User.findOne({userName:req.body.userName}, (err,doc)=>{
if(doc){
    return res.render("signup_form", {error:"Username alreaday taken, sorry"})
};
});
const hash = bcrypt.hashSync(req.body.password, salt);
const user = new User({
    userName: req.body.userName,
    password: hash
});
user.save((err,result)=>{
    if(!err){
        return res.redirect("/signup");
    }
})
});


// Route for Login
router.get("/login", (req,res)=>{
    if(req.session.currentUser){
        return res.redirect("/login");
    }
    res.render("login_form", {error:null})
});
router.post("/login", (req,res)=>{
User.findOne({userName:req.body.userName}, (err,doc)=>{
    if(err){
        return res.render("login_form", {error:"Username Incorrect"});
    }
    if(bcrypt.compareSync(req.body.password, doc.password)){
        req.session.currentUser = doc;
        res.redirect("/login");
    }
})
});




// Route Home
router.get("/", function(req,res,next){
    res.render('index', {title:'Test1'});
});



module.exports = router;