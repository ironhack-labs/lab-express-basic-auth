const router = require('express').Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10
const User = require('../models/User.model')

router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs')
})

router.post('/signup', async (req, res, next) => {

    try{
        const {username, password} = req.body
       
        if(!username || !password) return res.render('auth/signup.hbs', {errorMessage: "Please entre a username and a password"})

        const existAlready = await User.findOne({username: username})
        console.log('CREDENTIAL', existAlready)
        if(existAlready) return res.render('auth/signup.hbs', {errorMessage: "User already exists"})
    
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedpwd = bcrypt.hashSync(password, salt);
    
       const newUser = await User.create({username: username, password: hashedpwd})
       res.redirect('/signin')
    }
    catch(err){
        next(err)
    }
})

router.get('/signin', (req, res, next) => {
    res.render('auth/signin.hbs')
})

router.post('/signin', async (req, res, next) => {

    try{
        const {username, password} = req.body

        if(!username || !password) return res.render('auth/signup.hbs', {errorMessage: "Please entre a username and a password"})

        const user = await User.findOne({username: username})

        if(!user) return res.render('auth/signup.hbs', {errorMessage: "Wrong credentials"})

        const isValidPwd = bcrypt.compareSync(
            password,
            user.password
        )

        if(!isValidPwd) return res.render('auth/signup.hbs', {errorMessage: "Wrong credentials"})

        req.session.currentUser = user
        res.redirect('/user')

    }
    catch(err){
        next(err)
    }
})

router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });


module.exports = router