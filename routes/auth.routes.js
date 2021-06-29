const router = require('express').Router();

const bcrypt = require('bcryptjs');

const UserModel = require('../models/User.model')

router.get('/signup', (req, res) => {
    res.render('auth/signup.hbs')
})

router.post('/signup', (req, res, next) => {
    const { username, password} = req.body

    // if the impust are false or empty
    if( !username || !password ) {
        res.render('auth/signup.hbs', {error: 'please enter all fields'})
        return;
    }

    // password encription
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);




    UserModel.create( {username, password: hash} )
        .then(() => {
            res.redirect('/')
        })
        .catch((err) => {
            //res.redirect('/signup')
            next(err)
        })
 })

 router.get('/signin', (req, res) => {
     res.render('auth/signin.hbs')
 })

 router.post('/signin', (req, res, next) => {
     const { username, password } = req.body

     // I have to check if the name is in the Data Base
     UserModel.findOne( {username} ) 
        .then((client) => {
            if (client) {
                // if the name exist in the data base
                let isCorrect = bcrypt.compareSync(password, client.password);
                if (isCorrect) {


                    req.session.loggedInClient = client

                    req.app.locals.isLoggedIn = true;

                    res.redirect('/profile')
                }
                else {
                    res.render('auth/signin.hbs', {error: 'Password in Incorrect'} )
                }
            }
            else {
                res.render('auth/signin.hbs', {error: 'Name does not exists'} )
            }
        })
        .catch((err) => {
            next(err);
        })
 })

 function checkLoggedIn(req, res, next) {
     if (req.session.loggedInClient) {
         next()
     }
     else {
         res.redirect('/signin')
     }
 }

 router.get('/profile', checkLoggedIn, (req,res) => {
     if (req.session.loggedInClient){
        res.render('auth/profile.hbs', {name: req.session.loggedInClient.username} )
     }
     else{
         res.redirect('/signin')
     }
 })

 router.get('/private', checkLoggedIn, (req,res) => {
    res.render('auth/private.hbs')
 })

 router.get('/main', checkLoggedIn, (req,res) => {
    res.render('auth/main.hbs')
 })

 router.get('/logout', (req, res, next) => {
    req.session.destroy()

    // set global
    req.app.locals.isLoggedIn = false;
    res.redirect('/')
 })









module.exports = router;