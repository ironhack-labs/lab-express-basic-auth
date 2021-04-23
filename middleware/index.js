const isUserLoggedIn = (req, res, next ) => {
    
    req.session.currentUser ? next() : res.redirect('auth/login')


}

module.exports = isUserLoggedIn