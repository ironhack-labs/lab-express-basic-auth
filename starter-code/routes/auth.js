const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post('/signup', async (req, res, next) => {
    try {

        let { username, password } = req.body;

        let hashPassword;
        if (password) {
            const saltRouds = 3;
            const salt = bcrypt.genSaltSync(saltRouds);
            hashPassword = bcrypt.hashSync(password, salt);
        }

        await new User({ username, password: hashPassword }).save();

        res.redirect('/');
    } catch (err) {
        console.log("Sign up falhou. ", err);

        if (err.message.includes('dup key')) {
            res.render('signup', { errorMessage: 'Esse usuário já existe' });
        }

        if (err.message.includes('required')) {
            res.render('signup', { errorMessage: 'Preencha todos os campos' });
        }
    }
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/login', async (req, res, next) => {
    try {

        let { username, password } = req.body;
        if (!password || !username) {
            res.render('login', { errorMessage: 'Preencha todos os campos' })
            return
        }

        const user = await User.findOne({ username });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            res.render('login', { errorMessage: 'Usuário ou senha incorretos' })
            return;
        }

        req.session.loggedUser = user;
        res.redirect('/celebrities');
    } catch (err) {
        console.log("Login falhou. ", err);
    }
});

module.exports = router;