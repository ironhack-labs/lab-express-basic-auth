const isLogedin = (req, res, next) => {
    const user = req.session.user
    if (user) {
        next()
        return
    }
    res.redirect('/login')
}

module.exports = isLogedin