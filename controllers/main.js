exports.mainPage = async(req, res) => {
    if (req.session.user) res.render('main', req.session.user)
    else res.redirect('/login')
}