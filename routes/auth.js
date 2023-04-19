const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")

router.get("/signup", (req, res, next) => {
    res.render("signup")
})

router.get("/login", (req, res, next) => {
    res.render("login")
})


router.post("/signup", (req, res, next) => {
    const { username, password } = req.body

    User.findOne({username: username})
    .then(userFromDb => {
        if ( userFromDb !== null) {
            res.render("signup", { message: "Already taken"})
            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        User.create({username, password: hash })
        .then(() => {
            res.redirect("/login")
        })
        
    })

})

module.exports = router