let {Router} = require("express");
let mongoose = require("mongoose");
let User  = require("../models/User.model");
let router = new Router();
let bcryptjs = require('bcryptjs');
let {isLoggedIn, isLoggedOut} = require('../middleware/route-guard');

router.get("/signup", isLoggedOut, (req, res)=>{
    res.render("auth/signup.hbs");
})

router.post("/signup", (req, res) => {
    let {username, password} = req.body;

    if(!username || !password){
        res.render('auth/signup', {errorMessage: 'All fields are mandatory. Please add your username and/or password.'});
        return;
    }

    async function encriptPassword(){
        try{
        let salt = await bcryptjs.genSalt(5);
        let hashedPassword = await bcryptjs.hash(password, salt);
        await User.create({
            username,
            password: hashedPassword,
        });
        res.redirect('/profile');
    }
    catch(error){
        if (error.code === 11000){
            res.status(500).render('auth/signup', {errorMessage: 'Username must be unique. Please choose a different username.', });
        }
        else{
            console.log(error);
        }
    }
    }
    encriptPassword(); 

})

router.get("/profile", isLoggedIn, (req, res) => {
    res.render("auth/profile.hbs", {userInSession: req.session.currentUser})
})

router.get("/login", (req, res)=>{
    res.render("auth/login.hbs");
})

router.post("/login", (req, res) => {
        let {email, password} = req.body;
        if(email === '' || password=== ''){
            res.render('auth/login.hbs', {
                errorMessage: 'Please fill all the required fields.'
            });
            return;
        }
        async function validate(){
            try{ 
                let user = await User.findOne({username});
                if(!user){
                    res.render('auth/login', {errorMessage: 'User is not registered. Try other, if you may.'})
                } else if (bcryptjs.compareSync(password, user.password)){
                    req.session.currentUser = user; 
                    res.redirect('/profile');
                } else {
                    res.render('auth/login', {errorMessage: 'Wrong Password'})
                }
            }
            catch(error){
            }
        }
    validate();
});

module.exports = router; 