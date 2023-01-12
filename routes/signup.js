const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/signup',(req,res) => {
    res.render('signup')
})

router.post('/signup', (req,res) => {
    const {username, password} = req.body;     
    bcryptjs
    .genSalt(saltRounds)
    .then((salt) => {
        return bcryptjs.hash(password,salt)
    })
    .then((hashedPassword) => {
        console.log(hashedPassword)
        User.create({
            username: username, 
            password: hashedPassword
        })
        res.redirect('signup')
    })
    .catch(err => console.log("There is an error:", err))
})

module.exports = router;