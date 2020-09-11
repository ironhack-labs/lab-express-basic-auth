const express = require('express')
const User = require('../model/user.model')
const router = express.Router()
const bcrypt = require("bcrypt")
// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/registro',(req,res) => res.render('sign-up'))
router.post('/registro',(req,res)  => {

    

    const bcryptSalt = 10
   
    //router.get('/perfil', (req, res) => res.render('profile', req.session.currentUser))

    const {username, password} = req.body

    if (password.length < 3){

        res.render('sign-up',{errorMessage: "la contraseña es demasiado corta"})
        return
    }
    User.findOne({username})
    .then(userFound => {
        if (userFound){
            res.render('sign-up',{errorMessage: "el usuario ya existe"})
            return
        }
        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password,salt)
        User.create({username, password:hashPass})
            .then(() => res.redirect('/'))
            .catch(err => console.log(error))
            
    })

})
    router.get('/login' ,(req,res) =>res.render('login-up'))
    router.post('/login' ,(req,res) => {

        const {username,password} = req.body

        if (username === '' || password === ''){

            res.render('login-up',{errorMessage: "rellena los campos"})
            return
        }

        User.findOne({username})
            .then(userFound => {
                if (!userFound){
                   
                    res.render('login-up',{errorMessage: "usario no registrado"})
                    return
                }
                if (bcrypt.compareSync(password,userFound.password))
                {
                    req.session.currentUser = userFound
                    console.log(userFound)
                    res.redirect("/")
                }else{
                    console.log("else")
                    res.render('login-up',{errorMessage:'contraseña incorrecta'})
                }
            })
            .catch(err => console.log(err))
    })


router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('login-up', { errorMessage: 'Inicia sesión para acceder...' })
    }
})
router.get('/main', (req, res) => res.render('main', req.session.currentUser))

router.get('/private', (req, res) => res.render('private', req.session.currentUser))

module.exports = router
