const checkLogin = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/auth/login')
    }
}

module.exports = checkLogin