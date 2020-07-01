const express = require("express");
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

const createUser = async (username, password) => {
    try {
        const hash = bcrypt.hashSync(password, 10)
        const user = await User.create({ username, password: hash })
        return user
    } catch (error) {
        console.log(error)
    }

}
const getUser = async (username) => {
    const user = await User.findOne({ username })
    return user
}



/* GET home page */
router.get('/login', (req, res, next) => res.render('login'));

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body
    const message = username === '' ? 'Password and a username cannot be empty' : null
    if (message !== null) {
        return res.render('login', { message })
    }

    const user = await getUser(username)

    if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        return res.redirect('/main')
    }
    return res.render('login', { message: "Credentials wrong" })
})


router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body
    const message = username === '' || password === '' ? 'Password and a username cannot be empty' : null
    if (message !== null) {
        return res.render('signup', { message })
    }

    const alreadyExists = await getUser(username)

    if (alreadyExists) return res.render('signup', { message: 'User already exists' })

    const user = await createUser(username, password)

    if (user === undefined) {
        res.render('signup', { message: 'Error' })
    }
    req.session.user = user;
    return res.redirect('/main')

});

router.get('/signup', (req, res, next) => res.render('signup'));

router.get('/logout', (req, res, next) => {
    req.session.destroy()
    res.redirect('login')
});


module.exports = router;
