
function isLoggedIn(req, res, next) {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('auth/login', { errorMessage: 'Log in to access' })
    }
}

function isLoggedOut(req, res, next) {
    if (!req.session.currentUser) {
        next()
    } else {
        res.redirect('/my-profile')
    }
}


module.exports = {
    isLoggedIn,
    isLoggedOut
}