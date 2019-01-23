module.exports.main = (req, res, next) => {
  const user = req.session.user;
  res.render('users/main', {user});
}

module.exports.private = (req, res, next) => {
  const user = req.session.user;
  res.render('users/private', {user});
}