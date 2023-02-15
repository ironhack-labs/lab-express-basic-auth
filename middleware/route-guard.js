const isLoggedIn = (req, res, next) => {
    if (!req.session.user) res.redirect('/')
    next();
}

const isLoggedOut = (req, res, next) => {
    if (req.session.user) res.redirect('/profile')
    next();
}

module.exports = {isLoggedIn, isLoggedOut};