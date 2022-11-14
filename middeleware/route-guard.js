//funtion for login proteccion
function isLoggedIn(req, res, next) {
    if (req.session.currentUser) {
        next()
    } else {
        res.render('auth/login', { errorMessage: 'you have to Sign Up!' })
    }
}

//funtion for logout proteccion

function isLoggedOut(req, res, next) {
    if (!req.session.currentUser) {
        next()
    } else {
        res.redirect('/mi-profil')
    }
}
module.exports = {
    isLoggedIn,
    isLoggedOut
}