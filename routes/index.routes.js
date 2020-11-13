const express = require('express');
const router = express.Router();
const User = require('../models/User.model');


//GET HOME PAGE
router.get('/', (req, res, next) => res.render('index'));

//GET SIGN UP PAGE

router.get('/sign-up', (req, res, next) => {
    res.render('signUp')
})

router.post('/sign-up', (req, res, next) => {
    
    const {email, password} = req.body
    
    User.findOne({email: email})
    .then((result) => {
        if(!result) {
            bcrypt.genSalt(10)
            .then((salt) =>{
                bcrypt.hash(password, salt)
                .then((hashedPassword) => {
                    const hashedUser = {email: email, password: hashedPassword}
                    User.create(hashedUser)
                    .then((result) => {
                        res.redirect('/')
                    })
                })
            })
            .catch((err) => {
                console.log(err)
                res.render(err)
            })
        } else {
            res.render('login', {errorMessage: 'Este usuario ya existe. ¿Querías hacer Log In?'})
        }
    })
})

//GET LOG IN PAGE

router.get('/log-in', (req, res, next) => {
    res.render('login')
})

router.post('/log-in', (req, res, next) => {
    const {email, password} = req.body
    User.findOne({email: email})
    .then((result) => {
        if(!result){
            res.render('login', {errorMessage: 'Este usuario no existe. Lo sentimos.'})
        } else {
            bcrypt.compare(password, result.password)
            .then((resultFromBcrypt) => {
                console.log(resultFromBcrypt)
                if(resultFromBcrypt) {
                    req.session.currentUser = email
                    console.log(req.session)
                    res.redirect('/')
                    //req.session.destroy
                } else {
                    res.render('login', {errorMessage: 'Contraseña incorrecta. Por favor, vuelva a intentarlo'})
                }
            })
        }
    })
})

module.exports = router;
