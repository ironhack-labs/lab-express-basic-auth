const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const isLoggedIn = require('../middleware/route-guard')


router.get('/signup', (req, res) => {

    res.render('auth/signup');
  
});

router.post('/signup', async (req, res, next) => {

    try {

        const {username, email, password} = req.body;

        if(!email || !password ||!username) {
            res.render('signup', {errorMessage: 'Please input all fields'})
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({username, email, password: hashedPassword});

        res.render('auth/login')
        
    } catch (error) {
        console.log(error);
        next(error);
    }
})


router.get('/login', (req, res) =>  res.render('auth/login'));

router.post('/login', async (req, res, next) => {

    try {

        let {username, password} = req.body;

        if(!username || !password) {
            res.render('auth/login', {errorMessage: 'Please input all fields'})
        }

        let user = await User.findOne({username});

        if(!user){
            res.render('auth/login', {errorMessage:'Account does no exists'})
        }else if(bcrypt.compareSync(password, user.password)){

            //user can login
            req.session.user = user;
            res.redirect('profile')
        }else {

            res.render('auth/login', {errorMessage: 'Password is incorrect'})
        }

        
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/profile', async (req, res, next) => {

    let user = req.session.user;

    res.render('profile', user)
})

router.get('/forbidden', (req, res) => {
    let data ={layout:false}
    res.render('forbidden', data);
})

router.get('/main', isLoggedIn, (req, res, next) => {
    let data ={layout:false}
    res.render('main', data);
})

router.get('/private', isLoggedIn, (req, res, next) => {
    let data ={layout:false}
    res.render('private', data);
})

router.post('/logout', (req, res, next) => {
    req.session.destroy((err) =>{
        if(err) next(err)
        else res.redirect('/');
    })
})

module.exports = router;