const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User.model');

const router = express.Router();


router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    const { userName, userPassword } = req.body;

    const validationErrors = {};

    if(userName.trim().length === 0) {
        validationErrors.userNameError = 'Type your name';
    }
    if(userPassword.trim().length === 0) {
        validationErrors.userPasswordError = 'Creat a password';
    }

    if(Object.keys(validationErrors).length > 0) {
        return res.render('signup', validationErrors);
    }

    try {
        const userFromDb = await User.findOne({ name: userName });

        if(userFromDb) {
            return res.render('signup', {userNameError: 'User already exists'});
        }
    
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const encryptedPassword = bcrypt.hashSync(userPassword, salt);

    await User.create({
        name: userName,
        password: encryptedPassword,
    });

    res.redirect('/login');
    } catch (error){
    console.log(error)
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req,res) => {
    try {
        const { userName, userPassword } = req.body;

        const userFromDb = await User.findOne({ name: userName });
                  
        if(!userFromDb) {
            return res.render('login', {errorMessage: 'Invalid username/email'});
        }
    
        const isPasswordValid = bcrypt.compareSync(userPassword, userFromDb.password);

        if(!isPasswordValid) {
            return res.render('login', {errorMessage: 'Invalid username/password'})
        }
        
        req.session.currentUser = userFromDb;
       
        res.redirect('/main');

    } catch (error){
    console.log(error)
    }
});

router.use((req,res,next) => {
    if (req.session.currentUser) {
        return next();
    }
    res.redirect('login')
});

router.get('/main', (req, res) => {
     res.render('main')
});

router.get('/private', (req, res) => {
    res.render('private')
});

router.get('/logout', (req,res) => {
    req.session.destroy();

    res.redirect('login')
});

module.exports = router;