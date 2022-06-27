
const router = require("express").Router();
const user = require("./../models/User.model")

const bcryptjs = require("bcryptjs");
const User = require("./../models/User.model");
const saltRounds = 10

router.get("/registro", (req, res) => {
    res.render("auth/signup")

})

router.post("/registro", (req, res) => {

    const { username, password: plainPassword } = req.body

    console.log("Esto NUNCA debe ir a la BBDD", plainPassword)

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ username, password: hashedPassword }))
        .then(() => res.redirect("/"))
        .catch(err => console.log(err))

})

router.get("/inicio-sesion", (req, res) => {
    res.render("auth/login")
})

router.post("/inicio-sesion", (req, res) => {

    const { username, password: plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render("auth/login", { errorMessage: "Estos campos son obligatorios" })
        return
    }

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render("auth/login", { errorMessage: "No conozco a ese señor" })
                return
            }

            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render("auth/login", { errorMessage: "Maldito impostor" })
                return
            }

            req.session.currentUser = user //Inicio de sesión

            res.redirect("/")
        })

})




module.exports = router