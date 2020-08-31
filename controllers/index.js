const bcrypt = require("bcrypt")
const User = require('../models/User.model')

exports.showSignIn = (req, res) => res.render('../views/login.hbs')
exports.createUser = async (req, res) => {
    // Extraeer info del req.body
    const {username, password, repeatedPassword} = req.body
    // Verificar si enviaron el formulario completo
    if(username === '' || password === '' || repeatedPassword === ''){
        return res.render('../views/index.hbs', {error: "Missing fields"})
    }
    // Verificar que la el username no se repita
    const existingUser = await User.findOne({username})
    if(existingUser){
        return res.render('../views/index.hbs', {error: "Username already in use"})
    }
    // Hashear la contraseña
    const salt = bcrypt.genSaltSync(12)
    const hashPwd = bcrypt.hashSync(password, salt)
    const user = await User.create({
        username: username,
        password: hashPwd
    })
    console.log(user)
    res.redirect('/login')
}

exports.showLogin = (req, res) => {
    res.render('../views/login.hbs', {counter: req.session.counter})
}

exports.loginProcess = async (req, res) => {
    // Extraer info del body
    const {username, password} = req.body
    // Verificar toda la información
    if(username === '' || password === '' || repeated-password === ''){
        return res.render('../views/login.hbs', {error: "Missing fields"})
    }
    // Tomar al usuario y comparar la contraseña
    const user = User.findOne({username})
    if(!user){
        return res.render('../views/login.hbs', {error: "Error"})
    }
    if(bcrypt.compareSync(password, user.password)){
        req.session.user = user
        console.log("Matched")
        req.render('../views/profile.hbs', {user})
    } else {
        return res.render('../views/login.hbs', {error: "Pasword doesn't match"})
    }
}

exports.showProfile = (req, res, next) => {
    res.render('../views/profile.hbs')
}
