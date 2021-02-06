const express = require ("express");
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require("../models/User.model.js")

router.get('/signup', (req, res, next)=> 
res.render('login/signup'));

const saltRounds = 10


router.post('/signup', (req, res, next)=>{
    const { username, inputPassword} = req.body
    bcrypt.genSalt(saltRounds)
    .then(salt=> bcrypt.hash(inputPassword, salt))
    .then(hashedPassword => {
        return User.create({username, password: hashedPassword})
    })
    .then(newUserDbs => console.log(newUserDbs))
    .catch(err=> console.log("Error, a new user has not been added to the database",err))

})

module.exports = router