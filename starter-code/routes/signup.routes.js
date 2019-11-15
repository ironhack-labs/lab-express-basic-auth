const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")

const bcryptSalt = 10

const User = require ("../models/user.model")

router.get('/', (req, res) => res.render('signup'))

router.post("/", (req, res) => {

    console.log('entering signup POST')

    const {
        username,
        password
    } = req.body

    if (!username || !password) {
        res.render('signup', {
            errorMessage: "please fill out all fields"
        })
        return
    }
    User.findOne({ "username" : username})
    .then (user => {
        if (user) {
            res.render ('signup', { errorMessage: "user already exists"})
            return
        }
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync (password, salt)

        User.create({ username, password: hashPass})
        .then(()=> res.redirect ('/'))
        .catch(error => {console.log(error)})
    })
})

module.exports = router;