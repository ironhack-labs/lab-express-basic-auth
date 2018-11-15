const express =require("express");

const router =express.Router();

const bcrypt = require ("bcrypt");

const User =require("../model/user-model.js");


router.get("/signup",(req,res,next)=>{
  res.render("auth-views/signup-form.hbs");
});


router.post("/process-signup",(req,res,next)=>{
  const{username,originalPassword} =req.body;

  if(originalPassword.length === 0 ){
    req.flash("error","You need to enter password")
    res.redirect("/signup")
    return;

  }

  const encryptedPassword = bcrypt.hashSync(originalPassword,10)


User.create({username,encryptedPassword})
.then(userDoc=>{
  req.flash("success","Signup success");
 res.redirect("/")
})
.catch(err=>next(err));
});

router.get("/login",(req,res,next)=>{
  res.locals.messages = req.flash();
  res.render("auth-views/login-form.hbs")
});


router.post("/process-login",(req,res,next)=>{

  const {username,originalPassword} = req.body;

  User.findOne({username:{$eq:username}})
  .then(userDoc=>{
    if(!userDoc){
      req.flash("error","incorrect email");
      res.redirect("/login");
      return;
    }
    const {encryptedPassword} =userDoc;

    if(!bcrypt.compareSync(originalPassword,encryptedPassword)){

      req.flash("error", "Incorrect password");
      res.redirect("/login");
    }

    else{
      req.flash("success","log in success!");
      res.redirect("/")
    }


  })
  .catch(err=>next(err));
});




module.exports = router;