const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const Users = require("../models/User.model");

const saltRounds = 11;

/* GET home page */
router.get('/auth/signup', (req, res, next) => res.render('auth/signup'));



router.post('/auth/signup', (req, res, next) => {
    const {username, email, passwordHash} = req.body
    const passwordRegexFormat = /(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    const emailRegexFormat = /^\S+@\S+\.\S+$/;

    if(!username || !email || !passwordHash){
        res.status(200).render('auth/signup', {errorMessage: "fill out all fields"})
    return;
    }
    
    if(!passwordRegexFormat.test(passwordHash)){
    res.status(200).render('auth/signup', {errorMessage: "Your password should include 6 digits, uppercase and lowercase!"
    });
    return;    
    }

    if(!emailRegexFormat.test(email)){
    res.status(200).render('auth/signup', {errorMessage: "Your email is not in the right format"
    });
    return;    
    }

    bcrypt.hash(passwordHash, saltRounds)
    .then((hash) => {
        console.log(hash)
        Users.create({username, email, passwordHash: hash});
    }).then((newUser) => {
        req.session.currentUser = newUser;
        res.redirect('login'); 
    })
    .catch(hashErr => {
        console.error("error")
    })
}
);




router.get('/auth/login', (req, res, next) => res.render('auth/login'));

router.post('/auth/login', (req, res, next) => {
    const {email, passwordHash} = req.body;
    
    if (!email || !passwordHash){
        res.status(200).render('auth/login', {errormessage: 'all fields are required'});
        return;
    }
    Users.findOne({email})
    .then((foundUser) => {

        if (!foundUser){
            res.status(200).render('auth/login', {errorMessage: 'this email is not in our db'});
            return;
        }
        bcrypt
        .compare(passwordHash, foundUser.passwordHash)
        .then(verifiedStatus => {
        if(verifiedStatus){
            req.session.currentUser = foundUser;
            res.redirect('welcome')

        }else{
            res.status(200).render('auth/login', {errorMessage: 'Password is not correct'});
            return;
        }
        })
        .catch((compareErr) => {
            console.error(`error verifing password ${compareErr}`);
            next(compareErr);
        })
    })
    .catch((findErr) => {
                console.error("error")
                next(findErr);
    })
})


router.get('/auth/welcome', (req, res) => {
    const {currentUser} =req.session;
    res.status(200).render('auth/welcome', currentUser)
})

module.exports = router;

