const router = require("express").Router();
const mongoose = require('mongoose');
const User = require('../models/User.model.js');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

// Require Auth Middleware
const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard.js');

/* GET Signup page */
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post('/login', (req,res)=>{
    const {username, password} = req.body;
    console.log('SESSION =====> ', req.session);
    if(username === '' || password===''){
        res.render('auth/login.hbs', {
            errorMessage: 'Please fill all the required fields.'
        });
        return;
    }
    async function userLogin(){
        try{ 
            let user = await User.findOne({username});
            if(!user){
                res.render('auth/login', {errorMessage: 'User is not registered. Please Signup first'})
            } else if (bcryptjs.compareSync(password, user.passwordHash)){
                req.session.currentUser = user; 
                console.log('test',req.session.currentUser);
                
                console.log('test2',req.session);
                
                res.redirect('/profile');
            } else {
                res.render('auth/login', {errorMessage: 'Wrong Password'})
            }
        }
        catch(error){console.log(error);}
    }
    userLogin();
})

router.get('/profile', isLoggedIn, (req, res)=>{
    console.log(req.session)
    res.render('user/profile.hbs', {userInSession: req.session.currentUser});
});

router.post('/logout', (req, res)=>{
    // Kill the Session
    req.session.destroy(err=>{
        if(err){console.log(err)}
        res.redirect('/');
    })
})

module.exports = router;