
exports.profile = (req, res) => {
    if (req.session.user){
        res.render("main", req.session.user)
    }
    else{
        res.redirect ("/auth/login")
    }
}

exports.secret = (req, res) => {
    if (req.session.user){
        res.render("secret", req.session.user)
    }
    else{
        res.redirect ("/auth/login")
    }
}