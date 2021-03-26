const router = require('express').Router();
const User = require('../models/User.model');
const authenticator = require('../bin/auth');

router.get('/sign-up', (req, res, next) => res.render('sign-up'))

router.post('/sing-up', async (req, res, next) => {
    const validationErrors = await authenticator.validateInfo(req.body);
    
    if (validationErrors instanceof Error) {
        return next(validationErrors);
    } else if (Object.keys(validationErrors).length) {
        return res.render('sign-up', validationErrors);
    }
    
    let { username, email, password } = req.body;
    
    try {
        password = await authenticator.encrypt(password);

        await User.create({ username, email, password });

        res.redirect('/login');
    }

    catch (error) {
        next(error);
    }
})

router.get('/login', (req, res) => res.render('login'));

module.exports = router;