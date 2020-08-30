exports.getPrivate = async (req, res) => {
  if (req.session.currentUser) {
    res.render("private");
    console.log(req.session);
  } else {
    res.redirect("/");
  }
};
