const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');


router.get("/signup", (req, res, next) => {
    res.render("signup");
});

router.post('/signup', (req, res, next) => {
    const {
        username,
        password
    } = req.body;
    console.log(username, password)
    if (password.length < 8) {
        res.render('signup', {
            message: 'message must be at least8 characters'
        })
        return;
    }
    if (username === '') {
        res.render('signup', {
            message: 'username cannot be blank'
        });
        return;
    }
    User.findOne({username: username})
    .then(foundUser=>{
        if(foundUser !== null){
            res.render('signup', {message: 'username already taken'});
        }else{
            const salt= bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);
            console.log(hash);
            User.create({username: username, password: hash})
            .then(createdUser => {
                console.log(createdUser);
                res.redirect('/')
            })
        }
    })
})

module.exports = router;