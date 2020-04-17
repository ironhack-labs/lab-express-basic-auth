const express = require('express');
const router = express.Router();
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const bcryptSalt = 10


/* GET Sign Up page */
router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {

    const { username, password } = req.body

    if (!username || !password) {
        res.render('auth/signup', { errormessage: 'Los campos no pueden estar vacios!' })
        return
    }

    User.findOne({ username })
        .then(foundUser => {

            if (foundUser) {
                res.render('auth/signup', { errormessage: 'Este usuario ya existe' })
                return
            }



            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)


            User.create({ username, password: hashPass })
                .then(newUserCreated => res.redirect('/'))
                .catch(err => console.log(err))

        })

})


// Login

router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {

    const { username, password } = req.body

    if (!username || !password) {
        res.render('auth/login', { errormessage: 'Los campos no pueden estar vacios!' })
        return
    }

    User.findOne({ username })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errormessage: 'Este usuario no existe' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errormessage: 'Contraseña incorrecta!' })
                return
            }

            console.log(foundUser)
            req.session.currentUser = foundUser
            res.redirect('/')


        })
        .catch(err => console.log(err))
})



module.exports = router;