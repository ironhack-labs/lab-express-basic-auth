const isLoggedIn = (req, res, next) => {
    req.session.currentUser ? next() : res.redirect('/sessionStart')
}

module.exports = { isLoggedIn }