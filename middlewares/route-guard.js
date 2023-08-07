const isloggedIn = (req, res, next) => {
    if (req.session.currentUser) {
        next()
    }
    else {
        res.redirect('/log-in')
    }
}

const isLoggedOut = (req, res, next) => {
    if (!req.session.currentUser) {
        next()
    } else {
        res.redirect('/')
    }
}

module.exports = {

    isloggedIn,
    isLoggedOut
}