const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')


const bcryptSalt = 10;
const User = require('../models/User.model')

//------SIGNUP----//

router.get('/signup', (req, res) => {
    console.log("teo no te quiere naide")

    res.render('signup')
});

router.post('/signup', (req, res) => {

    const { username, password } = req.body

    if (!username || !password) {
        res.render('signup', { errorMessage: 'Estupido!!! Son dos campos' })
        return
    }

    User.findOne({ "username": username })
        .then(user => {
            if (user) {
                res.render("signup", { errorMessage: "El usuario ya existe, no seas copión" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            User.create({ username, password: hashPass })
                .then(() => res.redirect("/"))
                .catch(error => console.log(error))
        })
        .catch(error => { console.log(error) })
})


//---------LOGIN------------//

router.get("/login", (req, res, next) => res.render("login"))

router.post("/login", (req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("login", { errorMessage: "Vete al carajo" })
        return
    }

    User.findOne({ "username": username })
        .then(user => {
            if (!user) {
                res.render("login", { errorMessage: "No existes" })
                return
            }

            if (bcrypt.compareSync(password, user.password)) {
                req.session.currentUser = user;   
                res.redirect("/");
            } else {
                res.render("login", { errorMessage: "Te olvidaste de tu contraseña?" })
            }
        })
        .catch(error => console.log('error', error))
})

module.exports = router

