const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res) => {
    res.render('auth/signup');
  });
  
router.get('/login', (req, res) => {
    res.render('auth/login')
});

router.post('/login', (req, res, next) => {
    User.findOne({email:req.body.email})
    .then(user => {
        if(!user) {
            req.body.error = "Este usuario no existe :)"
            return res.render('auth/login', req.body)
        }
        if (bcrypt.compareSync(req.body.password, user.password)) {
            req.session.currentUser = user;
            res.render('main')
        } else {
            req.body.error = "La contraseña no es correcta :)"
            return res.render('auth/login', req.body)
        }
    })
    .catch(e => next(e))
});

router.post('/signup', (req, res, next) => {
    if(req.body.password !== req.body.password2){
        req.body.error = "Las contraseñas no coinciden :)";
        res.render('auth/signup', req.body)
    }
    //encriptar password
    const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    req.body.password = hash;
    User.create(req.body)
    .then(user => res.send(user))
    .catch(e => next(e))
})

function isAuthenticated(req, res, next){
    if(req.session.currentUser){
        return next()
    } else {
        res.redirect('/login');
    }
}

router.get('/private', isAuthenticated, (req, res) => {
    res.render('private')
})

router.get('/main', isAuthenticated, (req, res) => {
    res.render('main')
})
// router.get('/logout', (req,res,next)=>{
//     req.session.destroy(()=>{
//         res.redirect('/login');
//     })
// });


// function isLoggedIn(req, res, next){
//     if(req.session.currentUser){
//         res.redirect('/private')
//     } else {
//         next()
//     }
// }

module.exports = router;