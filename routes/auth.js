const router = require("express").Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')

router.get('/signup', (req, res, next) => {
        res.render('signup')
});

router.post('/signup', (req, res, netx) => {
    const { username, password } = req.body
    if (password.length < 6) {
        res.render ('signup', { message: ' Password should have more than 6 characters'})
        return
    }
    if (username === '') {
        res.render ('signup', { message: 'Please create an username' })
        return
    } 
    User.findOne({ username: username })
        .then(userFromDB => {
            if ( userFromDB !== null ) {
                res.render ('signup', { message: 'This username already exist' })
            } else {
                const salt = bcrypt.genSaltSync()
                const hash = bcrypt.hashSync( password, salt)
                //console.log (hash)
                User.create({ username: username, password: hash })
                    .then (createdUser => {
                        console.log(createdUser)
                        res.redirect('/login')
                    })
                    .catch(err => next(err))
            }
        })
})

router.get('/login', (req, res, next) => {
	res.render('login')
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body
    User.findOne({ username: username })
    .then( userFromDB => {
        if (userFromDB === null) {
            res.render('login', { message: 'Incorrect password, or username'})
            return
        }
        if (bcrypt.compareSync(password, userFromDB.password)) {
            req.session.user = userFromDB
            res.redirect('/profile')
        } else {
            res.render('login', { message: 'Incorrect password, or username'})
            return
        }        
    })
})


router.get('/logout', (req, res, next) => {
    req.session.destroy()
	res.redirect('/')
})

module.exports = router;
