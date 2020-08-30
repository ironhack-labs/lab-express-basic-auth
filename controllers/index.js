exports.home = (req, res) => {
    req.session.counter = req.session.counter ? req.session.counter + 1 : 1
    console.log(req.session)
    res.render("index", { counter: req.session.counter })
}

exports.profile = (req, res) => {
    if (req.session.user) {
        res.render("profile", req.session.user)
    } else {
        res.redirect("/")
    }
}