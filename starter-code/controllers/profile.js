exports.profile = (req, res) => {
  res.render('profile', req.session.currentUser)
}

exports.privado = (req, res) => {
  res.render('private', req.session.currentUser)
}
