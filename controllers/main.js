exports.getMain = async (req, res) => {
  if (req.session.currentUser) {
    res.render("main");
  } else {
    res.redirect("/");
  }
};
