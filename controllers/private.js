exports.main = (req, res) => {
    if (req.session.user) {
        res.render("main", req.session.user)
    } else {
        res.redirect("/auth/login")
    }
}

exports.private = (req, res) => {
    if (req.session.user) {
        res.render("private", req.session.user)
    } else {
        res.redirect("/auth/login")
    }
}