const router = require("express").Router() //express
const bcryptjs = require('bcryptjs') //encriptador


const User = require('../models/User.model')
const saltRounds = 10 //indico el grado de complegidad del encriptador (no pasarte de 14)

//sing-in

router.get('/registro', (req, res, next) => res.render('auth/sing-in'))

router.post('/registro', (req, res, next) => {
    const { email, username, password } = req.body

    bcryptjs
        .genSalt(saltRounds) //genero la sal
        .then(salt => bcryptjs.hash(password, salt)) //uso la sal junto con el password plano
        .then(hasedPsw => {
            console.log('el hash creado es', hasedPsw)
            return User.create({email, username, passwordHash:hasedPsw}) //genero el usuario con el pas haseado
        })
        .then(createdUsr => res.redirect('/'))
})


module.exports = router


//Log-in

router.get('/login', (req, res, next) => res.render('auth/log-in'))

router.post('/login', (req, res, next)=> {

    const { email, password } = req.body

    if (email.length === 0 || password.length === 0){
        res.render('auth/log-in', {errorMsg:'Introduce todos los datos para continuar'})
        return 
    }

    User 
        .findOne({email})
        .then(user => {
            if(!user){
                res.render('auth/log-in', {errorMsg:'Usuario desconocido'})
                return
            }else if(!bcryptjs.compareSync(password, user.passwordHash)){
                res.render('auth/log-in', { errorMsg: 'Contraseña incorrecta'})
                return
            }else {
                req.session.currentUsr = user
                console.log(req.session)
                res.redirect('/perfil')
            }

        })
    
})

//Log Out 

router.post('/salir', (req, res, next)=> {
    req.session.destroy(()=>res.redirect('/'))
})