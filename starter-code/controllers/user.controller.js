module.exports.main = (req, res, next) => {
  res.render('user/main', { user: req.session.currentUser });
  // res.send("hola");
};
module.exports.private = (req, res, next) => {
  res.render('user/private', { user: req.session.currentUser });
  // res.send("hola");
};