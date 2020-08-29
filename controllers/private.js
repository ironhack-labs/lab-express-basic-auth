exports.privatePage = async(req, res) => {
    if (req.session.user) res.render('private', req.session.user)
    else res.redirect('/login')
}