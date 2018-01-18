module.exports.main = (req, res, next) => {
  res.render('user/main', { userValidated: req.session.currentUser });
  // res.send("hola");
};
module.exports.private = (req, res, next) => {
  res.render('user/private', { userValidated: req.session.currentUser });
  // res.send("hola");
};