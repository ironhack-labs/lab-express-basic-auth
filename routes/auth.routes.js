const router = require("express").Router();
const bcrypt = require('bcryptjs')
const saltRound = 10

const User = require('./../models/User.model')


router.get("/register", (req, res, next) => {
    res.render("user/register")
})
router.post('/register', (req, res, next) => {
    const { username, password } = req.body
    bcrypt
        .genSalt()
        .then(salt => bcrypt.hash(password, salt))
        .then(hashPass => User.create({ username, password: hashPass }))
        .then(() => res.redirect("/login"))
        .catch(err => next(err))

})

router.get("/login", (req, res, next) => {
    res.render("user/login")
})

router.post("/login", (req, res, next) => {
    const { username, password } = req.body

    bcrypt
    if (username.length === 0 || password.length === 0) {
        res.render("user/login", { errorMessage: 'Los Campos Son obligatorios' })
        return
    }
    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('user/login', { errorMessage: "Usuario No encontrado" })
                return
            }
            if (!bcrypt.compareSync(password, user.password)) {
                res.render('user/login', { errorMessage: "Contraseña Incorrecta" })
                return
            }
            req.session.currentUser = user
            res.redirect('/profile')
        })
})
router.get("/logOut", (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router