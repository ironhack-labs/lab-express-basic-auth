const isLoggedIn = (req,res,next) => {
    if(!req.session.currentUser) {
        res.redirect('/login')
    }
    next()
}

const isLoggedOut = (req,res,next) => {
    if(req.session.currentUser) {
        res.redirect('/profile')
    }
    next()
}

module.exports = {isLoggedIn,isLoggedOut}