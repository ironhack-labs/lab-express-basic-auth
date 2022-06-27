const router = require("express").Router();
const User = require("./../models/User.model")

const bcryptjs = require("bcryptjs");
const saltRounds = 10


// Sign Up routes

router.get("/signup", (req, res) => {
    res.render("auth/signup")
})

router.post("/signup", (req, res) => {

    const { username, password: plainPassword } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPwd => User.create({ username, password: hashedPwd }))
        .then(() => res.redirect("/"))
        .catch(err => console.log(err))
})

// Log In routes

router.get("/login", (req, res) => {
    res.render("auth/login")
})

router.post("/login", (req, res) => {

    const { username, password: plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/login', { errorMessage: 'You must fill both fields' })
    }

    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: `User doesn't exist` })
                return
            }

            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Incorrect password' })
                return
            }

            req.session.currentUser = user
            res.redirect('/myprofile')
        })
        .catch(err => console.log(err))

})

module.exports = router;