const express=require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/login', (req,res) =>{
    res.render('login');
})

router.post('/signup', (req,res) =>{
    const {username, password} =req.body;
    if(password.length< 8){
        res.render('signup',  {message:'Your password must be 8 characters minimum'});
        return;
    }
    if(username===''){
        res.render('signup', {message: 'Your username cannot be empty'});
        return;
    }
    User.findOne({username:username})
    .then((found)=>{
        if (found !== null){
            res.render('signup', {message: 'Username is already taken'});
        } else{
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);
            
            User.create({username:username, password:hash})
            .then(dbUser =>{
                res.redirect('/login');
            })
            .catch(err =>{
                next(err);
    });
}
})
});



router.post('/login', (req, res, next) =>{
const {username, password} = req.body;
User.findOne({username: username})
.then((found)=>{
    if(found===null){
        res.render('login', {message: 'Invalid credentials'});
        return;
    }
    if(bcrypt.compareSync(password, found.password)){
        req.session.user=found;
        res.redirect('/profile');
    } else{
        res.render('login', {message:'Invalid credentials'});
    }
})
.catch(err => {next(err);})
});

router.get('/logout', (req, res) =>{
    req.session.destroy(err =>{
        if(err) next(err);
        else res.redirect('/');
    });
});

module.exports=router;