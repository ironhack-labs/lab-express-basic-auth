function isLoggedIn (req, res, next){
    if(!req.session.currentUser){
        res.redirect('/login')
    }
    next()
}

function isLoggedOut ( req, res, next){
    if (req.session.currentuser){
        res.redirect('/')
    }
        next()
}

module.exports = {isLoggedIn, isLoggedOut}