const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs")
const bcryptSalt = 10
const app = require('../app')

const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const User=require('../models/User.model')
router.get('/registro', (req, res) => res.render('auth/signup-form'))
router.post('/main', (req, res) => {
    const { username, password } = req.body
             const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)
    User.create({
        username: username,
        password:hashPass
    })
        .then(user => {
        res.render("auth/main", user)
        })
    
   

})
router.get('/log-in', (req, res) => {
    res.render("auth/login-form")
})

router.post('/private', (req, res,next)=>{
     const { username, password } = req.body
   
       if (username === "" || password === "") {
        res.render("auth/login-form", { errorMsg: "Rellena todos los campos, merluzo" })
        return
    }

    User
        .findOne({ username })
        .then(user1 =>{
        if (!user1) {
            res.render("auth/login-form", { errorMsg: "Regístrate antes de iniciar sesión" })
            console.log("holaaaa")
        return
        }
            if (!bcrypt.compareSync(password, user1.password)) {
                console.log(password, user1.password)
            res.render("auth/login-form", { errorMsg: "Contraseña incorrecta" })
            return
         }
            req.session.currentUser = user1        // inicio de sesión
   res.render("auth/private",user1);        })
        .catch(err => console.log(err))
        })
router.get('/cerrar-sesion', (req, res) => req.session.destroy((err) => res.redirect("/")))




module.exports = router