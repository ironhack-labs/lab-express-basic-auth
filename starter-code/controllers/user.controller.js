module.exports.main = (req, res, next) => {
  res.render('user/main', { user: req.session.currentUser });
  // res.send("hola");
};