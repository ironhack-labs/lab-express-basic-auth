const express = require('express');

const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");

const salt = bcrypt.genSaltSync(10);

router.get("/", function(req, res, next) {
    let currentName=null;
    if(req.session.currentUser){
        currentName=req.session.currentUser.userName
        res.render("users/index", {message: true, name:currentName});
    } else {
        res.render("users/index", {message: false,name:currentName});
    }
  });

router.get("/signUp", function(req, res, next) {
   
    res.render("users/signUp", {error:null});
  });

router.post("/signUp", function(req, res, next) {
    if(req.body.password2 !== req.body.password1){
        return res.render("users/signUp", {error:"Your passwords don't match!"})
    }
    User.findOne({userName:req.body.name}, (err,doc)=>{
        if(doc){
          return res.render("users/signUp", {error:"Your username is taken"})
        } else {
            const hash = bcrypt.hashSync(req.body.password1, salt);
            const user = new User({
              userName: req.body.name,
              password: hash
            });
            user.save((err,result)=>{
            if(!err){
            return res.redirect("/users");
        }
      });
        }
      });
      
  });

  router.get("/logIn", function(req, res, next) {
    if(req.session.currentUser){
        return res.redirect("/users");
    }
    res.render("users/logIn", {logError:null});
  });

router.post("/logIn", function(req, res, next) {
    User.findOne({userName:req.body.name}, (err,doc)=>{
        if(err){
            return res.render("users/logIn", {logError:"Your Username is incorrect"})
        } else {
            if (doc){
                if(bcrypt.compareSync(req.body.password, doc.password)){
                    req.session.currentUser = doc;
                    res.redirect("/users");
                  } else {
                      res.render("users/logIn", {logError:"Your Password is wrong"})
                  }
            } else {
                return res.render("users/logIn", {logError:"Your Username is incorrect"})
            }
            
        }
        
      });
      
  });

module.exports = router;
