const router = require("express").Router();


const bycypt = require('bcryptjs')
const User = require('../models/User.model');
const saltRounds = 10



/* GET home page */
router.get("/", (req, res,) => {
    res.render("index");
});



router.get('/registro', (req, res) => {
    res.render('auth/signup.hbs')
})


router.post('/registro', (req, res, next) => {
    const { username, email, plainPassword } = req.body

    bycypt
        .genSalt(saltRounds)
        .then(salt => bycypt.hash(plainPassword, salt))
        .then(passwordHast => User.create({ username, email, password: passwordHast }))
        .then(() => res.redirect('/'))
        .catch(err => next(err))

})


router.get('/inicio-sesion', (req, res) => {
    res.render('auth/login.hbs')


})


router.post('/inicio-sesion', (req, res, next) => {

    const { email, password } = req.body


    if (email.length === 0 || password.length === 0) {
        res.render('auth/login.hbs', { errorMessage: 'Rellenar todos los campos' })
        return
    }

    User
        .findOne({ email })
        .then(foundUser => {
            if (!foundUser) {
                res.render('auth/login.hbs', { errorMessage: 'Email no registrado' })
                return
            }
            if (bycypt.compareSync(password, foundUser.password) === false) {
                res.render('auth/login.hbs', { errorMessage: 'Contraseña incorrecta' })
                return
            }

            req.session.currentUser = foundUser
            console.log('SESION INICIADA -> ', req.session)
            res.redirect('/')
        })

        .catch(err => next(err))



})


router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})




module.exports = router;