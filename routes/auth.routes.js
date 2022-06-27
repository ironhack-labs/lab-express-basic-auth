const router = require("express").Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

router.get('/register', (req, res) => {
    res.render('auth/register');
})

router.post('/register', (req, res) => {
    const { email, password } = req.body;

    console.log("EMAIL: ", email, " PASSWORD: ", password);

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPwd => User.create({ email, password: hashedPwd }))
        .then(() => res.redirect("/"))
        .catch(err => console.log(err));
})


router.get('/login', (req, res) => {
    res.render('auth/log-in');
})


router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log("Gestionando log in")
    if (email === "" || password === "") {
        res.render('auth/log-in', { errorMsg: "The fields cannot be empty" });
        return;
    }
    User.findOne({ email })
        .then(user => {
            console.log("Query result", user);
            if (user === null) {
                console.log("Entering null");
                res.render('auth/log-in', { errorMsg: "The email does not match any user" });
                return;
            }
            console.log("comparing pass")
            if (bcryptjs.compareSync(password, user.password) === false) {
                res.render('auth/log-in', { errorMsg: "The password does not match" })
                return;
            }
            req.session.currentUser = user;
            console.log("Entrando al redirect de /")
            res.redirect('/');
        })
        .catch(err => console.log(err));


})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;