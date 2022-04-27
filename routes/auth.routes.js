const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

router.get('/auth/signUp', (req, res) => {
    res.render('auth/signUp')
})

router.post('/auth/signUp', (req,res) => {
    const { password, email } = req.body   
    const saltRounds = 12

    const salt = bcrypt.genSaltSync(saltRounds)
    const newPassword = bcrypt.hashSync(password, salt);

    const emailLowerCase = email.toLowerCase()
    req.body.passwordHash = newPassword
    delete req.body.password
    console.log(req.body)
    User.create(req.body)
        .then(() => {
            res.redirect("/userProfile")
        }).catch(console.log)
})


module.exports = router;