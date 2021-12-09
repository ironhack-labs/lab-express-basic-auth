const router = require('express').Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');

router.get('/createUser', (req, res, next) => res.render('auth/signup'));

router.post ('/createUser', async (req, res, next) => {
    const { email, username, password, ...rest } = req.body;
    try {
        const salt = bcryptjs.genSaltSync(10);
        const newPassword = bcryptjs.hashSync(password, salt);
        const user = await User.create({email, username, password: newPassword});
        res.redirect('logged');
    } catch (error) {
        console.log(error);
        res.send('error')
    }
});

router.get('/logged', (req, res, next) => res.render('logged'));

module.exports = router;