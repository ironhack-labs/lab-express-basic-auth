const router = require("express").Router();
const bcryptjs = require('bcryptjs')
const saltRounds = 10

/////Cristian
const User = require('./../models/User.model')
router.get('/registrate', (req, res) => {
    // res.send('estoy en el registro?')
    res.render('auth/register')
})
router.post('/registrate', (req, res, next) => {

    const { username, plainPassword } = req.body
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ username, password: hashedPassword }))
        .then(() => res.redirect('/inicia-tu-sesion'))
        .catch(err => console.log('no se ha resgitrado nada' + err))

})

router.get('/inicia-tu-sesion', (req, res) => {
    res.render('auth/login')
})

router.post('/inicia-tu-sesion', (req, res) => {

    const { username, plainPassword } = req.body
    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/login', { errorMessage: 'rellena campo merluzoo' })
        return
    }
    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'no hay usario' })
                return
            }
            if (!bcryptjs.compareSync(plainPassword, user.password)) {
                res.render('auth/login', { errorMessage: 'Contraseña no valida majo' })
                return
            }
            req.session.currentUser = user
            res.redirect('/mi-perfil')
        })
        .catch(error => next(error))
})
module.exports = router