function isLoggedIn(req, res, next) {
    if (!req.session.user) {
        console.log('No user in this Session');
        return res.redirect('/auth/login');
    }
    next();
}

module.exports = { isLoggedIn }