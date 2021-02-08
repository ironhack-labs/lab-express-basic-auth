module.exports.isAuthenticated = ((req, res, next) => {
    if (req.session.currentId) {
        next()
    } else {
        res.redirect('/login')
    }
})

module.exports.isNOTAuthenticated = ((req, res, next) => {
    if (!req.session.currentId) {
        next()
    } else {
        res.redirect('/in')
    }
})