const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
        return
    }
    res.redirect('/auth/login');
}

const isLoggedOut = (req, res, next) => {
    if (req.session.user) {
        next();
        return
    }
    res.redirect('/user')
}

module.exports = { isLoggedIn, isLoggedOut }