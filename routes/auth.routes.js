const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs')
const User = require("../models/User.model")

const saltRounds = 10

router.get("/sing-up",(req,res,next)=>{
    res.render("auth/sing-up")
})
router.post("/sing-up",(req,res,next)=>{
    const {username,password}=req.body
    console.log(username)

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword=> {
            
            User.create({username,password:hashedPassword})})
        .then(()=> res.redirect('/'))
        .catch(error => next(error))
})

router.get("/log-in", (req, res, next) => {
    res.render("auth/log-in")
    
})

router.post("/log-in", (req, res, next)=>{
    const {username,password} = req.body
    console.log(username+password)
    User
        .findOne({username})
        .then((user) => {
            if(!user){
                res.render("auth/log-in", { errorMessage: 'nombre no registrado' })
                return
            } else if (bcryptjs.compareSync(password, user.password)===false){
                res.render('auth/log-in', { errorMessage: 'La contraseña es incorrecta' })
            }else{
                console.log(user)
                req.session.currentUser = user
                res.redirect('/')
            console.log('El objeto de EXPRESS-SESSION', req.session)
            }
        })
})
module.exports = router;