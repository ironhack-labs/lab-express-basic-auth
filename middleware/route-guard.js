//Checks if the user is logged out when trying to enter the protected routes
const isLoggedOut = (req, res, next) => {
    if (!req.session.loggedUser) {
        return res.redirect('/login')
    }
    next()
}

//If an already logged in user tries to access the login page it
//redirects the user to the home page
const isLoggedIn = (req, res, next) => {
    if (req.session.loggedUser) {
        return res.redirect('/')
    }
    next()
}

module.exports = {
    isLoggedIn,
    isLoggedOut
}