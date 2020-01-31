require('dotenv').config()
const bcrypt = require('bcrypt')
const User = require('../models/User')


exports.signupView = (req, res, next) => {
    res.render('signup')
}

exports.loginView = (req, res, next) => {
    res.render('index')
}

exports.signupPost = async (req, res, next) => {
    const { username, password } = req.body
    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashPassword = await bcrypt.hash(password, salt)
    const user = await User.create({username, password: hashPassword})
    res.redirect('welcome')
}

exports.loginPost = async (req, res, next) => {
    const {username, password} = req.body
    const user = await User.findOne({ username })
    if(!user){
        res.send('Error de usuario o contraseña')
    } else {
        const trusted = await bcrypt.compare(password, user.password)
        if(trusted){
            req.session.loggedUser = user
            req.app.locals.loggedUser = user
            res.redirect('welcome')
        } else {
            res.send('Error de usuario o contraseña')
        }
    }
}

exports.welcomeView = (req, res, next) => res.render('welcome', )

exports.logout = async (req, res, next) => {
    await req.session.destroy()
    res.redirect('/login')
}