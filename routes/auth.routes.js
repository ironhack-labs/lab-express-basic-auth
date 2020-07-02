const express = require("express");
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');


// Function to create a new User
const handlerCreateUser = async (username, password) => {
    try {
        const hash = bcrypt.hashSync(password, 10)
        const user = await User.create({ username, password: hash })
        return user
    } catch (error) {
        console.log(error)
    }

}

// Function to get a User from DB
const handlerGetUser = async (username) => {
    try {
        const user = await User.findOne({ username })
        return user
    } catch (error) {
        console.log(error)
    }
}


/* GET Login page */
router.get('/login', (req, res, next) => res.render('login'));

/* Login process */
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body
    const message = username === '' ? 'Password and a username cannot be empty' : null
    if (message !== null) {
        return res.render('login', { message })
    }

    const user = await handlerGetUser(username)

    if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        return res.redirect('/main')
    }
    return res.render('login', { message: "Credentials wrong" })
})

/* GET Sign Up page */
router.get('/signup', (req, res, next) => res.render('signup'));

/* Create a new User and after go to Main page */
router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body
    const message = username === '' || password === '' ? 'Password and a username cannot be empty' : null
    if (message !== null) {
        return res.render('signup', { message })
    }

    const alreadyExists = await handlerGetUser(username)

    if (alreadyExists) return res.render('signup', { message: 'User already exists' })

    const user = await handlerCreateUser(username, password)

    if (user === undefined) {
        res.render('signup', { message: 'Error' })
    }
    req.session.user = user;
    return res.redirect('/main')

});

// Logout user of current session and redirect to Login
router.get('/logout', (req, res, next) => {
    req.session.destroy()
    res.redirect('login')
});


module.exports = router;
