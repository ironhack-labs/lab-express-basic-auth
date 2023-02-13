const isLoggedIn = (req, res, next) => {
    if (req.session.currentUser) {
        next()
    }
    else {
        res.render('auth/login-form', { errorMessage: 'Login to continue' })
    }
}


const isLoggedOut = (req, res, next) => {
    if (!req.session.currentUser) {
        next()
    }
    else {
        res.redirect('/main')
    }
}




module.exports = { isLoggedIn, isLoggedOut }