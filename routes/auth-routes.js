const User = require("../models/User.model")

const router = require("express").Router()

const bcryptjs = require('bcryptjs')
const saltRounds = 12

router.get('/signup',(req,res)=>{
    res.render('auth/signup')
})

router.post('/signup',(req,res)=>{
    const {username, password} = req.body

    bcryptjs.genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password,salt))
    .then((hashedPass) => User.create({username,password:hashedPass}))
    .then((userFromDB) => res.redirect('/user/user-profile'))
    .catch(error => console.log(error));
})

module.exports = router