const router = require("express").Router();
const UserModel = require('../models/User.model');
const bcrypt = require('bcryptjs')

router.get('/signup', (req,res, next) => {
    res.render('auth/signup')
});

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body

    if(!username || !password){
        res.render('auth/signup', {error: 'Please enter all fields'})
        return;
    }

    let passRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*].*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,14}$/
    if (!passRegEx.test(password)) {
        res.render('auth/signup.hbs', {error: 'Password needs to have a 2 special characters, a number, and be 6-14 characters'})
        return 
    }
    
    const salt = bcrypt.genSaltSync(12)
    const hash = bcrypt.hashSync(password, salt)
    
    UserModel.create({username, password: hash})
    .then(() => {
        res.redirect('/')
    })
    .catch(() => {
        res.render('auth/signup.hbs', {error: 'Username is already in use'})
    })
})

router.get('/login', (req,res, next) => {
    res.render('auth/login')
});

router.post('/login', (req,res, next) => {
    const {username, password} = req.body
    console.log(username, password)

    UserModel.findOne({username})
        .then((user) => {
            console.log(user)
            if(user){ 
                const {password: hashfromDB} = user
                let isValid = bcrypt.compareSync(password, hashfromDB)
                if (isValid) {

                    req.session.loggedInUser = user;
                    req.app.locals.isLoggedIn = true;
                    res.redirect('/main');

                }
                else{
                    res.render('auth/login', {error: 'Password Invalid'})
                }
            }else{
                res.render('auth/login', {error: 'Username does not exist'})
            }
        })
        .catch((err) => {
            next(err)
        })  
});

router.get('/logout', (req, res,next) => {
    req.session.destroy()
    req.app.locals.isLoggedIn = false;
    res.redirect('/')
})

function checkIfLoggedIn(req, res, next){
    if (req.session.loggedInUser) {
        next()
    }
    else{
        res.redirect('/login')
    }
}

router.get('/main', checkIfLoggedIn, (req, res, next) => {
    res.render('main.hbs') 
}) 

router.get('/private', checkIfLoggedIn, (req, res, next) => {
    res.render('private.hbs') 
}) 


module.exports = router;
  