const bcrypt = require("bcrypt")
const User = require("../models/user")

exports.signupProcess = (req, res) => {
    const {username, password} = req.body

    if (username === "" || password === ""){
        res.render("signup", {errorMessage: "Missing fields"})
    }

    User.findOne({username})
        .then(user => {
            if (!user) {
                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(password, salt)
                User.create({
                    username, password: hashPassword
                })
                    .then(() => {
                        res.redirect("/")
                    })
                    .catch(err => console.log(err))
            }
            else {
                res.render("signup", {errorMessage: "Username already in use"})
            }
        })
        .catch(err => console.log(err))
}

exports.loginProcess = (req, res) => {
    const {username, password} = req.body

    if (username === "" || password === "") {
        res.render("login", {errorMessage: "Missing fields"})
    }

    User.findOne({username})
        .then(user => {
            if (!user) {
                res.render("login", {errorMessage: "This user does not exist"})
            }
            else if (bcrypt.compareSync(password, user.password)){
                req.session.currentUser = user
                res.redirect("/")
            }
            else {
                res.render("login", {errorMessage: "Wrong Password"})
            }
        })
        .catch(err => console.log(err))
}