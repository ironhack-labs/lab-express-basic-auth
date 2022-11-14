const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');

const User = require('./../models/User.model')
const saltRounds = 10

const { isLoggedOut } = require('./../middleware/route.guards');

/* GET home page */
router.get("/register", (req, res) => {
    res.render("auth/singup");
});

router.post('/register', isLoggedOut, (req, res) => {
    const { username, password } = req.body
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt)
        })
        .then(hashedPassword => {
            return User.create({ username, password: hashedPassword })
        })
        .then(() => res.redirect('/inicio-sesion'))
        .catch(err => console.log(err))
})

router.get('/inicio-sesion', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

router.post('/inicio-sesion', isLoggedOut, (req, res) => {
    const { username, password } = req.body
    User
        .findOne({ username })
        .then(user => {
            console.log(req.params)

            if (!user) {
                res.render('auth/login', { errorMessage: 'username no reconocido' })
                return
            }

            if (bcryptjs.compareSync(password, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
                return
            }
            req.session.currentUser = user      // login
            res.redirect('/mi-perfil')
        })
        .catch(err => console.log(err))
})

router.get('/cierre-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/inicio-sesion'))
})

module.exports = router;
