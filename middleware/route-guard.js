const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/signin')
        return

    }
    next();
}



module.exports = {
    isLoggedIn,
}