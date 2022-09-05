const router = require('express').Router()
const bcrypt = require('bcryptjs/dist/bcrypt')
const UserModel = require('../models/User.model')

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

router.get('/login', (req, res, next) => {
    res.render('auth/login')
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body
    UserModel.findOne({ username })
        .then(async (user) => {
            const passMatch = await bcrypt.compare(password, user.password)
            return { passMatch, user }
        })
        .then((passCompare) => {
            if (passCompare.passMatch) {
                req.session.user = passCompare.user
                res.redirect('/main')
            } else {
                console.log("La contraseña no coincide")
                res.render('auth/login', {
                    message: 'Usuario o contraseña invalido'
                })
            }

        })
        .catch((err) => {
            console.log("Error logging in")
            next(err)
        })
})

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body
    bcrypt
        .genSalt(10)
        .then((salts) => {
            return bcrypt.hash(password, salts)
        })
        .then((hashedPass) => {
            return UserModel.create({ username, password: hashedPass })
        })
        .then(() => {
            console.log("New user created")
            res.redirect('/')
        })
        .catch((err) => {
            console.log('Error signing Up --->', err)
            next(err)
        })
})



module.exports = router

