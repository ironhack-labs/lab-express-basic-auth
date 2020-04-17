const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const bcryptSalt = 10
const User = require('../models/user')

router.get('/sign-up', (req, res, next) => {
    res.render('sign-up')

})

router.post('/sign-up', (req, res, next) => {

    const { email, password } = req.body
    if (!email || !password) {
        return
    }

    User.findOne({ email })
        .then(userInfo => {
            if (userInfo) {
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ email, password: hashPass })
                .then(newUser => {
                    console.log(newUser)
                    res.redirect('/')
                })
                .catch(err => console.log("Hubo un error!", err))

        })
        .catch(err => console.log("Hubo un error!", err))

})

module.exports = router;