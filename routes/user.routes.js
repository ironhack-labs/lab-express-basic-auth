const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')
const { isLoggedIn } = require('../middlewares/route-guard')

router.get('/catalogo', isLoggedIn, (req, res, next) => {
    res.render('motos/lista')
})

router.get('/crear', isLoggedIn, (req, res, next) => {
    res.render('motos/crear')
})


router.get('/user/myprofile', isLoggedIn, (req, res, next) => {
    const { _id, userName } = req.session.currentUser
    User
        .findById(_id)
        // .then(res.send({ _id, userName }))
        .then(res.render('user/profile', { userName }))
        // .then(res.render('user/profile'))
        .catch(err => console.log(err))

})




module.exports = router;
