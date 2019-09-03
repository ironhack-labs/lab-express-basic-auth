const express = require('express');
const router  = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signup", (req,res,next)=>{
  const user = req.body;
  if (!user.username || !user.password){
    res.render("signup", {errorMsg : "All fields are required"})
    return;
  } else {
    userModel
    .findOne({username: user.username})
    .then (dbRes =>{
      if (dbRes){
        res.render("signup", {errorMsg: "User already exists"})
        return;
      }
      const salt = bcrypt.genSaltSync(10);
      const hashed = bcrypt.hashSync(user.password, salt);
      user.password =hashed;
      userModel
      .create(user)
      .then(()=> res.redirect("/"))
      .catch(err => console.log(err));
    })
    .catch(dbErr => {
      next (dbErr);
    });
  }
});

router.post("/signin", (req,res,next) =>{
  const user = req.body; 
  if(!user.username || !user.password){
    res.render("signin", {errorMsg: "Please fill all the fiels"});
    return;
  }
  userModel
  .findOne({ username: user.username})
  .then (dbRes =>{
    if(!dbRes){
      res.render("signin", {errorMsg : "Bad credentials, please retry"});
      return;
    }
    if(bcrypt.compareSync(user.password, dbRes.password)){
      req.session.currentUser = user;
      res.redirect("/private");
      return;
    }else {
      res.render("signin", {errorMsg: "Bad credentials, please retry"})
      return;
    }
})
  .catch(dbErr => {
    next(dbErr);
  });
})

router.get("/private", (req, res) => {
  if (req.session.currentUser) {
    res.render("private", { userInfos: req.session.currentUser.username });
  } else {
    res.redirect("/signin");
  }
});

router.get("/logout", (req,res)=>{
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect("/signin");
  })
})


module.exports = router;
