const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const session = require('express-session')

router.get('/', (req, res) => {
    res.render('sign-up')
})

router.post('/', (req, res) => {
    const { email, password } = req.body
    const encrypted = bcrypt.hashSync(password, 15)

    new User({ email, password: encrypted }).save().then(result => {
        res.send('Account was created')
    })
})

module.exports = router
