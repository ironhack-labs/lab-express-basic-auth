const express = require('express');
const router = express.Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 12;

const User = require('../models/User.model')

router.get('/', (req, res, next) => res.render('index'));
router.get('/login', (req, res, next) => res.render('login'))
router.get('/usuariocreado', (req, res) => res.render('usuariocreado'))
router.get('/entrar', (req,res) => res.render('entrar'))
/*router.get('/userPrifile', (req, res) => {
    res.render('user/user-profile', { userInSession: req.session.currentUser})
})*/
// Variable de control de acceso..
let acceso = false

router.get('/main',(req, res, next)=>{
    if( acceso == true){
        res.render('main',{mensaje: "Acceso permitido"})
    }else{ res.render('main', {mensaje: "Acceso NO permitido"})}
})

router.get('/private',(req, res, next)=>{
    if( acceso == true){
        res.render('main',{mensaje: "Acceso permitido"})
    }else{ res.render('main', {mensaje: "Acceso NO permitido"})}
})




router.post('/entrar', (req, res, next) => {
    console.log('SESSION =====>', req.session)
 

    const { email, password } = req.body


    User.findOne({ email })
    .then(user => {
        if(!user) {
            res.render('entrar', { errorMessage: 'Email is not registerd'})
            return
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
            req.session.currentUser = user
            acceso = true
            res.render('entrar', {errorMessage: 'Bienvenido....'})
        }else {
            res.render('entrar', { errorMessage: 'Incorrect password' })
        }
    })

    .catch(error => next(error))
})



router.post('/signup', (req, res, next) => {

    console.log('SESSION ======>', req.session)

    const { email, password } = req.body

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
        return User.create({
            email,
            passwordHash: hashedPassword
        })
    })
    .catch(error => next(error))

    // Redirigimos la pagina para informar que el usuario se creo correctamente...
    res.redirect('/usuariocreado')

})




module.exports = router;

