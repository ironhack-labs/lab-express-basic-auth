const { Router } = require("express")

const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        return res.render('auth/login', { errorMessage: 'A donde vas pringao' })
    }
    next()

}

const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
        return res.redirect("/")
    }
    next()
}

module.exports = { isLoggedIn, isLoggedOut }

