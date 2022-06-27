const router = require("express").Router();

const User = require("./../models/User.model")

const bcryptjs = require("bcryptjs");
const saltRounds = 10

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

router.get('/login', (req, res) => {
    res.render('auth/login')
})

///////////////////////////////////////

router.post('/login', (req, res) => {

    const { username, password: plainPassword } = req.body



    if (username.length === 0 || plainPassword.length === 0) {

        res.render('auth/login', { errorMessage: 'Verboten! Campen obligatorien!' })
        return
    }
    User
        .findOne({ username })
        .then(user => {

            if (!username) {
                res.render('auth/login', { errorMessage: 'Usuarien no encontraden' })
                return
            }

            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Contraseñen no váliden' })
                return
            }

            req.session.currentUser = user          // Inicio de sesión
            res.redirect('/my-profile-main')
        })
        .catch(err => console.log(err))
})




module.exports = router;