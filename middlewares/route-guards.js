const isLoggedIn = (req, res, next) => {
    req.session.currentUser ? next() : res.redirect('/login')
}


const isLoggedOut = (req, res, next) => {
    !req.session.currentUser ? next() : res.redirect('/plant/list')
}

module.exports = { isLoggedIn, isLoggedOut }