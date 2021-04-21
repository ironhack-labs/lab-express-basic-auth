
const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

const passwordRegExp = new RegExp(/[!@%+\'!#$^?:.(){}[\]+~\-\_.1-9]+/);

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
})


router.post('/signup', async (req, res, next) => {
    const { username, password, email } = req.body;

    console.log(req.body)

    if (password.length < 8 || !passwordRegExp.test(password)) {
        console.log({ password })
        const message = "The password must be at least 8 characters long and contain one number and one special character [!@%+\/'!#$^?:.(){}[]~-_.]";
        res.render('auth/signup', { message: message });
        return;
    }

    if (await User.findOne({ username: username }) !== null) {
        res.render('auth/signup', { message: "The username is already taken" })
    } else {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        await User.create({ username, password: hash, email })

        res.redirect('/login');
    }
});

router.get('/login', (req, res, next) => {
    res.render('auth/login');
})

router.post('/login', async (req, res, next) => {
    const { username, password, email } = req.body;
    const user = await User.findOne({ username: username }) || await User.findOne({ email: username });

    if (user === null) {
        res.render('login', { message: "Invalid credentials" })
        return;
    }

    if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect('/profile');
    }
})

module.exports = router;
