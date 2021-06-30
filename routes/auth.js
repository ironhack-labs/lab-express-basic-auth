const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require('bcryptjs');

router.get('/signup', (req,res) => {
    res.render('auth/signup');
});

router.post("/signup", async (req, res) => {
    const {username, password} = req.body;
    if (username === "" || password === "") {
    res.render("auth/signup", {errorMessage: "Fill username and password"});
    return;
    };
    
    const user = await User.findOne({username: username});
    if(user !== null){
        res.render("auth/signup", {errorMessage: "username already exists"});
        return;
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt) 
    await User.create({
        username, 
        password: hashedPassword, 
    });
    res.redirect("/");
});

router.get("/login", (req, res) => {
    res.render('auth/login');
    })


    router.post("/login", async (req, res) => {
        const {username, password} = req.body;
        
    
        if ( !username || !password) {
            res.render('auth/login', {
            errorMessage: 'fill username and password',
            });
            return;
        }
    
        const user = await User.findOne({username});
        if (!user) {
            res.render('auth/login', {
                errorMessage: 'invalid login',
                });
                return;
            }
    
            if (bcrypt.compareSync(password, user.password)) {
                
                req.session.currentUser = user;
                res.redirect('/');
            } else {
               
                res.render('auth/login', {
                    errorMessage: 'invalid login',
                   });
            }
        });
    
module.exports = router;