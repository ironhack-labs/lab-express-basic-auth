exports.logoutFunc = async (req, res) => {
  console.log(req.session);
  req.session.destroy();

  console.log(`session destroyed ${req.session}`);
  res.redirect("/");
};
