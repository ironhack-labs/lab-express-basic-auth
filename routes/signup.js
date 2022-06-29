const router = require('express').Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');

router.get('/signup',(req,res,next)=>{
    console.log('Llegaste a la ruta de logueo');
    res.render('auth/signup');
})

router.post('/signup',(req,res,next)=>{
    const {username,password} = req.body;
    
    const salt = bcryptjs.genSaltSync(10)
    const hashedPassword = bcryptjs.hashSync(password,salt)
    console.log('password hash: ', hashedPassword)
    User.create({
            username,
            password:hashedPassword
        })
    .then(userFromDB =>{
        console.log('New user create', userFromDB)
        res.redirect(`user/userProfile/${userFromDB._id}`)
    })
    .catch(error =>{
        console.log('Ha salido un error en el post ID',error)
        next(error)
    })
})

router.get('/user/userProfile/:id',(req,res,next)=>{
    const {id} = req.params;
    console.log('Llegaste al get de userProfile')
    User.findById(id)
    .then(username =>{
        res.render('user/userProfile',username)
    })
    .catch(error =>{
        console.log('Ha salido un error en el get ID',error)
        next(error)
    })
})


module.exports = router;