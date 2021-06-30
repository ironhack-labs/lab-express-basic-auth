const express = require('express');
const router = express.Router();

//Require User
const User = require('../models/User.model');

//Require bcrypt
const bcrypt = require('bcryptjs');



function requireLogin(req, res, next) {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect('/login');
    }
}




//SIGN-UP
router.get('/signup', (req, res) => {
    res.render('auth/signup');
});


router.post('/signup', async (req, res) => {
    const {username, password} = req.body;


const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashedPassword = bcrypt.hashSync(password, salt);


await User.create({
    username,
    password: hashedPassword, //passing the hashed/encrypted password when creating a new object
});
res.redirect('/');
    
});




//LOG-IN
router.get('/login', (req,res) => {
res.render('auth/login');
});


router.post('/login', async (req, res) => {
const {
    username, 
    password,
} = req.body;
if(!username || !password){
    res.render('auth/login', {
errorMessage: 'Fill username and password'
    });
    return;
}
const user = await User.findOne({
    username
});
if(!user){
    res.render('auth/login', {
        errorMessage: 'Invalid login',
    });
    return;
}
if(bcrypt.compareSync(password, user.password)){
    req.session.currentUser = user;

    res.redirect('/private');
} else {
    res.render('auth/login', {
        errorMessage: 'Invalid login'
    });
}

res.render('auth/login');

});





router.get('/main', (req, res) => {
res.render('auth/main');
});

router.get('/private', requireLogin, (req, res) => {
    res.render('auth/private');
});




router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});




module.exports = router;

