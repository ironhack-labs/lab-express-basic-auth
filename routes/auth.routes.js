const router = require("express").Router();
const User = require("../models/User.model")

const bcryptjs = require("bcryptjs");
const saltRounds = 10

const { isLoggedIn, isLoggedOut } = require("../middleware/session-guard");

//sign up
router.get("/sign-up", isLoggedOut, (req, res) => {
    res.render("auth/signup")
})

router.post("/sign-up", isLoggedOut, (req, res) => {

    const { username, password: plainPassword } = req.body

    if(username.length === 0 || plainPassword.length === 0) {
        res.render('auth/signup', { errorMessage: 'Please fill in all required fields' })
        return
    }

    User
        .findOne({ username: username })
        .select({ username: 1 })
        .then(usernameDB => {
            if(usernameDB)
            res.render('auth/signup', { errorMessage: 'Username already exist, try another one' })
            return
        })
        .catch(err => console.log(err))

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPwd => User.create({ username, password: hashedPwd }))
        .then(() => res.redirect("/"))
        .catch(err => console.log(err))
})

//log in
router.get('/log-in', isLoggedOut, (req, res) => {
    res.render('auth/login')
})


router.post('/log-in', isLoggedOut, (req, res) => {

    const { username, password: plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/login', { errorMessage: 'Please fill in all required fields' })
        return
    }

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'The username did not match our records. Please double-check and try again' })
                return
            }

            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Incorrect password' })
                return
            }

            req.session.currentUser = user

            res.redirect('/profile')
        })
        .catch(err => console.log(err))
})

//log out
router.post('/log-out', (req, res) => {
    req.session.destroy()
    res.redirect('/log-in')
})

//main
router.get('/main', (req, res) => {
    res.render('main')
})

//private
router.get('/private', isLoggedIn, (req, res) => {
    res.render('private')
})

module.exports = router