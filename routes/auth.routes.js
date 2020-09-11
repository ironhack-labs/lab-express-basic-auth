const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")

const User = require('../models/user.model')

const bcryptSalt = 10


router.get("/signup", (req, res) => res.render('signup-form'))

router.post("/signup", (req, res) => {
    // console.log("--------", req.body)

    const {username, password} = req.body

    if(password.length < 5) {
        res.render('signup-form',{errorMessage: "la contraseña debe tener 6 o mas caracteres"})
        return}

    User.findOne({username})
        .then(user =>{
            if(user){
                res.render('signup-form', {errorMessage: 'el usuario ya está registrado'})
                return
            }

             const salt = bcrypt.genSaltSync(bcryptSalt)
             const hashPass= bcrypt.hashSync(password, salt)

            //  console.log(hashPass)

            User.create({username, password : hashPass})
                .then(() => res.redirect("/"))
                .catch(error => console.log(error))

        })
        .catch(error => console.log(error))
 

})

router.get('/login', (req, res) => res.render('login-form'))
router.post('/login', (req, res) =>{

    const {username, password} = req.body

    if(username === "" || password === "") {
        res.render('login-form', {errorMessage : "es necesario que rellene los campos usuario y contraseña"})
        return
    }

    User.findOne({username})
        .then(user => {
            if(!user) {
                res.render('login-form', {errorMessage : `usuario no registrado`})
        return
            }

        if(bcrypt.compareSync(password, user.password)){
            req.session.currentUser = user
            res.redirect("/") // ojo, no debería mandarlo a su perfil
        }else {
            res.render('login-form', {errorMessage : "Contraseña incorrecta"})
        }
            
        })
        .catch(error => console.log(error))
})



module.exports = router