const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User.model');

router.get('/signup', (req, res, next) => res.render('user/signup.hbs'));
router.post('/signup', async (req, res, next) => {
  const {username, password } = req.body;
  try {
     if (!username || !password) { res.render ('user/signup.hbs', {
        errorMessage: 'All the fields are mandatory.',
    });
     return;
    }
    const regex = /([A-Z])\w+/;
     if (!regex.test(password)) {
        res.status(500).render('user/signup.hbs', {
        errorMessage:'Invalid password, password needs to have 6 characters and include an uppercase and lowercase character',
    });
}

const salt = await bcrypt.genSalt(5);
const hashedPassword = await bcrypt.hash(password, salt);
const createdUser = await User.create({ username, password: hashedPassword });

res.redirect('/');
}
    catch (error) {
    console.log(error);
}
});


module.exports = router;

