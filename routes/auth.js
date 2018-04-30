const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/signup",(req,res)=>{
    res.render("auth/signup")
});


router.post("/signup", (req,res)=>{
    if(req.body.password1 !== req.body.password2){
        req.body.error = "No sabes leer perro?"
        return res.render("auth/signup",req.body);
    }

    bcrypt.genSalt(10,(err,salt)=>{
        req.body.password= bcrypt.hashSync(req.body.password1,salt);
        User.create(req.body)
        .then(r=>res.redirect("/login"))
        .catch(e=>console.log(e))
    })
})


router.get("/login",(req,res)=>{
    if(req.session.currenUser)return res.send("De aqui no sales")
    res.render("auth/login")
})

router.post("/login",(req,res)=>{

    User.findOne({username:req.body.username})
    .then(user=>{
        if(!bcrypt.compareSync(req.body.password,user.password)){
            req.body.error = "La cagaste pon tu contrasena bien"
            return res.render("private", req.body);
            }
            req.session.currenUser = user;
        res.render("main");
    })
    .catch(e=>res.send("No tienes usuario"))
})

router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      // cannot access session here
      res.redirect("/login");
    });
  });




module.exports = router;

