

function private(req, res, next) {
  if (!req.session.currentUser) {
     res.render("auth/private");
    return;
  }
  next();
}

module.exports = private;
