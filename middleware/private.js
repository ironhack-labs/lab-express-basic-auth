function private(req, res, next) {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }

  next();
}

module.exports = {
  private,
};
