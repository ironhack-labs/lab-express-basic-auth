const router = require('express').Router();
const User = require('../models/User.model');
const auth = require('./utils/auth');

router.get('/sign-up', (req, res, next) => res.render('sign-up'))

router.post('/sing-up', async (req, res, next) => {
    const validationErrors = await auth.validateInfo(req.body, next);
    
    if (Object.keys(validationErrors).length) {
        return res.render('sign-up', validationErrors);
    }
    
    let { username, email, password } = req.body;
    
    try {
        encryptedPassword = await auth.encrypt(password);

        await User.create({ username, email, password, encryptedPassword });

        res.redirect('/login');
    }

    catch (error) {
        next(error);
    }
})

router.get('/login', (req, res) => res.render('login'));

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body

    try {
        const retrivedUser = await User.findOne( { email } );
        
        const isPasswordCorrect = await auth.checkPassword(password, retrivedUser ? 
                                                                        retrivedUser.encryptedPassword : '');

        if (!retrivedUser || !isPasswordCorrect) {
            return res.render('login', { error: `Email ou senha incorreta.`})
        }
        
        req.session.currentUser = retrivedUser;

        res.redirect('/main');

    }
    
    catch (error) {
        next(error);
    }
})

module.exports = router;