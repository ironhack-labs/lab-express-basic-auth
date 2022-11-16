const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const saltRounds = 12;

router.get('/users/signup', (req, res) => {
    res.render('auth/signup');
});

router.post('/users/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('auth/signup', {
            errorMessage:
                'All fields are mandatory. Please provide your username, email and password.',
        });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const savedUser = await User.create({
        username,
        password: passwordHash,
    });

    console.log('created user: ', savedUser);

    res.send('successfully created');
});

module.exports = router;
