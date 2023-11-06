const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("./../models/User.model")
const saltRounds = 10

const isLoggedIn = require("./../middleware/route-guard")

router.get("/registro", (req, res) => {
    res.render("auth/signup")
})
router.post("/registro", (req, res) => {
    const { email, plainPassword } = req.body
    console.log(email, plainPassword)

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(passwordHash => User.create({ email, password: passwordHash }))
        .then(() => res.redirect("/inicio-sesion"))
        .catch(err => console.log("ERROR", err))
})


router.get("/inicio-sesion", (req, res) => {
    res.render("auth/login")
})

router.post("/inicio-sesion", (req, res) => {
    const { email, plainPassword } = req.body

    if (email.length === 0 || plainPassword.length === 0) {
        res.render("auth/login", { errorMessage: "Fill all" })
        return
    }

    User
        .findOne({ email })
        .then(foundUser => {

            if (!foundUser) {
                res.render("auth/login", { errorMessage: "Not register email" })
                return
            }

            if (bcrypt.compareSync(plainPassword, foundUser.password) === false) {
                res.render("auth/login", { errorMessage: "Wrong password" })
                return
            }

            req.session.currentUser = foundUser
            res.redirect("/private")

        })
        .catch(err => console.log("ERROR", err))

})

router.get("/cerrar-sesion", isLoggedIn, (req, res) => {
    req.session.destroy(() => res.redirect("/"))
})


module.exports = router