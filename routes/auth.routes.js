const router = require("express").Router();
const bcryptjs = require('bcryptjs')

const User = require('../models/User.model')

const saltRounds=10;


// Form signUP GET (render)
router.get('/sign-up', (req,res,next) => {
    res.render('../views/auth/signup-form')
})

// Form signUP POST (handle)
router.post('/sign-up', (req, res,next) => {
    const { username, userPwd} = req.body

    if(username.length===0 || userPwd.length===0){
        res.render('../views/auth/signup-form', { warningMessage : 'You need to complete all the fields'})
        return
    } 

    bcryptjs
        .genSalt(saltRounds)                                             //es el coste del algoritmo. Cuanto tiempo va a costar descrifrarlo
        .then(salt => bcryptjs.hash(userPwd, salt))                       // bcryptjs encripta el password
        .then(passwordEncrypt => {
            console.log('La clave encriptada generada es:', passwordEncrypt)
            return User
                    .create({ username, password: passwordEncrypt})       // 1. La clave en BBDD siempre es la encriptada. | 2. Return es importante para continuar con el then() fuera.
        })
        .then(userJustCreated => res.redirect('/'))
        .catch(err => res.render('../views/auth/signup-form', { warningMessage: err }))
})

// Form LogIn (render)
router.get('/login', (req,res,next) => {
    res.render('../views/auth/login-form')
})

// Form LogIn (handle)
router.post('/login', (req,res,next) => {
    const { username, userPwd } = req.body

    if(username.length===0 || userPwd.length===0){
        res.render('../views/auth/login-form', {warningMessage: 'You must complete all the fields'})
        return
    }

    User
        .findOne({ username })
        .then(user => {  
                req.session.currentUser = user
                console.log('El objeto de EXPRESS-SESSION', req.session)
                res.redirect('/main')
        })
        .catch(err => res.render('../views/auth/login-form', {warningMessage: err}))
 })

 //Form Log Out
router.post('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'))
})

module.exports = router;

