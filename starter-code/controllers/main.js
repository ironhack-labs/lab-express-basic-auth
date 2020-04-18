exports.main = (req, res) => {
  res.render("main", req.session.currentUser);
};