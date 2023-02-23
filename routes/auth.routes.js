const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');

const User = require('../models/User.model');
const saltRounds = 10;

router.get('/userProfile', (req, res) => res.render('users/user-profile'));


router.get('/signup', (req, res) => res.render('auth/signup'));


router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body;


try {

    let hash = await bcryptjs.genSalt(saltRounds)
    let hashedPassword = await bcryptjs.hash(password, hash)
    let user = await User.create({
        username,
        passwordHash: hashedPassword
    })
    res.redirect('/userProfile')


} catch (error) {
    next(error)

}
})







module.exports = router;
