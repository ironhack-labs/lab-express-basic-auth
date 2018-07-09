const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt")
const User = require ("../models/User")
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)

/* GET home page */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});
router.post('/signup', (req, res, next) => {
    const {name,password} = req.body
    console.log(name + password)
    User.findOne({name})
    .then(user=>{
        if(user !== null){
            throw new Error("User name already exists.")
        }
        const hashPass = bcrypt.hashSync(password,salt)

        User.create([{name,password:hashPass}]).then(user=>{
            req.session.user = user[0]
            //res.locals.user = user[0]
            res.redirect("/")
        })
        
    })
    
    .catch(err=>{
        console.log("ERROR SIGNUP")
        res.render('auth/signup',{errorMessage:err.message});

    })
  });
  
  router.get('/login', (req, res, next) => {
    res.render('auth/login');
  });

  router.post('/login', (req, res, next) => {
    const {name,password} = req.body
    const hashPass = bcrypt.hashSync(password,salt)
    console.log(hashPass)

    User.findOne({name})
    .then(user=>{
        
        if(user == null || !bcrypt.compareSync(password,user.password)){
            throw new Error("User or password doesnt exists.")
        }

        req.session.user = user
        res.redirect("/")

        
    })
    
    .catch(err=>{
        console.log(err.message)
        res.render('auth/login',{errorMessage:err.message});

    })
  });

  router.get("/logout",(req,res)=>{
    req.session.user = null
    res.redirect("/")
  })
  

module.exports = router;
