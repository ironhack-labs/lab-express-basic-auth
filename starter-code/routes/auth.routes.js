const express = require("express");
const router = express.Router();
const User = require("../models/user")
const bcrypt = require("bcrypt")



const bcryptSalt = 10;




router.get("/signUp", (req,res)=> res.render("auth/signUp"))


router.post("/signUp", (req,res) =>{

  const {username, password} = req.body;

  if(!username || !password){
    res.render("auth/signUp", {errmsg: "campos no rellenados"})
    return
  }
  User.findOne({username})
  .then(foundUser =>{
    if(foundUser){
      res.render("auth/signUp",{errmsg:"Usuario ya existente"})
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashpass = bcrypt.hashSync(password, salt)
  
  
  
    User.create({username, password:hashpass})
    .then(user => {
      console.log(user)
      res.redirect("/")
  
    })
    .catch(err=>console.log(err))

  })

})



router.get("/login", (req,res) =>{
  res.render("auth/login")

})
router.post("/login", (req,res)=>{
  const {username,password} = req.body;
  if (!username || !password) {
    res.render("auth/signUp", { errmsg: "campos no rellenados" });
    return;
  }

  User.findOne({username})
  .then(foundUser =>{
    
    if(!foundUser){
      res.render("auth/login", {errmsg:"no existe el usuario"})
      return
    }
    if(bcrypt.compareSync(password, foundUser.password)){
     req.session.currentUser = foundUser;
     console.log(req.session.currentUser)
     res.redirect("/")
    }else{
      res.render("auth/login", {errmsg:"te equivocaste de pass"})


    }

    console.log(foundUser)

  })







})



router.use((req,res,next) =>{
  if(req.session.currentUser){
    next()
    return
  }
  res.render("auth/login", {errmsg:"no has iniciado sesión"})
})

router.get("/main", (req,res) =>{
  res.render("main")

})
router.get("/private", (req,res) =>{
  res.render("private")

})


module.exports = router;