module.exports.isAuthenticated = (req, res, next) => {
    console.log('isAuth: ', req.user)
    if (req.user){
        next()
    }
    else {
        res.redirect("/")
    }
}
