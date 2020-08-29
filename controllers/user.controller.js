const bcrypt = require("bcrypt")
const User = require("../models/User.model")

exports.signupView = (req, res) => res.render("auth/signup")

exports.signupProcess = async (req, res) => {
    const { username, password } = req.body
    if (username === "" || password === "") {
        return res.render("auth/signup", { error: "Please fill all the fields to continue" })
    }
    const existingUser = await User.findOne({username})
    if(existingUser){
        return res.render("auth/signup", { error: "Username invalid" })
    }
    const salt = bcrypt.genSaltSync(12)
    const hashPswd = bcrypt.hashSync(password, salt)
    await User.create({
        username,
        password: hashPswd
    })
    res.redirect ("/auth/login")
}

exports.loginView = (req, res) => {
    console.log(req.session)
    res.render("auth/login")
}

exports.loginProcess = async (req, res) => {
    const {username, password} = req.body
    if (username === "" || password === "") {
        return res.render("auth/login", { error: "Please fill all the fields to continue" })
    }
    const existingUser = await User.findOne({ username })
    if(!existingUser){
        return res.render("auth/login", { error: "Username invalid" })
    }
    if (bcrypt.compareSync(password, existingUser.password)){
        req.session.user = existingUser
        res.redirect('/profile')
    }
    else{
        return res.render ("auth/login", { error: `The username or the password is incorrect` })
    }
}
