const isLoggedIn = (req, res, next) => {
    req.session.currentUser ? next() : res.redirect('/login')
}


const isLoggedOut = (req, res, next) => {
    !req.session.currentUser ? next() : res.redirect('/')
}

module.exports = { isLoggedIn, isLoggedOut }