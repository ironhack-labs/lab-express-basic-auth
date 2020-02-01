require('dotenv').config()
const bcrypt = require('bcrypt')
const User = require('../models/User')

exports.loginView = (req, res) => {
    res.render('login')
}

exports.signupView = (req, res) =>{
    res.render('signup')
}

exports.signupPost = async (req, res) => {
    const {username, password} = req.body
    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashPwd = await bcrypt.hash(password, salt)
    const user = await User.create({username, password: hashPwd})
    res.redirect('/login')
}

exports.loginPost = async (req,res) => {
    const { username, password} = req.body
    const user = await User.findOne({ username })
    if (!user) {
        config.err = 'Incorrect password or email'
        res.render('/login')
    } else {
        const correct = await bcrypt.compare(password, user.password)
        if (correct) {
            req.session.loggedUser = user
            req.app.locals.loggedUser= user
            res.redirect('/profile')
        } else {
            res.render('login')
        }
    }
}

exports.profileView = (req,res) => {
    res.render('profile')
}

exports.privateView = (req, res) => {
    res.render('private')
}

exports.logout = async (req, res) => {
    await req.session.destroy()
    res.redirect('/login')
}


