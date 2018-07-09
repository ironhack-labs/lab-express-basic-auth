const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')

function isAuthenticated(req,res,next){
    if(req.session.currentUser){
       return next()
    }else{
        res.redirect('/login');
    }
};


function isLoggedIn(req,res,next){
    if(req.session.currentUser){
        res.redirect('/private');
    }else{
        next();
    }
}

router.get('/main', isAuthenticated, (req,res,next)=>{
    res.render('auth/main')
})

router.get('/private', isAuthenticated, (req,res,next)=>{
    res.render('auth/private')
})


router.get('/signup', (req,res,next)=>{
    res.render('auth/signup')
})

router.post('/signup', isLoggedIn, (req,res,next)=>{
    if(req.body.password !== req.body.password2){
        req.body.error = 'Password dont match'
        return res.render('auth/signup', req.body)
    }
    const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    req.body.password = hash;
    User.create(req.body)
    .then(user=>{
        res.redirect('/login')
    })
    .catch(e=>next(e))
});

router.get('/login', isLoggedIn, (req,res,next)=>{
    res.render('auth/login')
})

router.post('/login', (req,res,next)=>{
    User.findOne({username: req.body.user})
    .then(user=>{
    if(!user){
        req.body.error = 'No existes'
        return res.render('auth/login', req.body)
    }
    if(bcrypt.compareSync(req.body.password, user.password)){
        req.session.currentUser = user;
        res.redirect('/private');
    }else{
        req.body.error = 'la password no es correcta'
            return res.render('auth/login', req.body)
    }
    })
    .catch(e=>next(e))
});

module.exports = router;