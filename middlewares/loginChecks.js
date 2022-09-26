function ensureUserIsLoggedOut(req, res, next) {
  if (req.session.currentUser) {
    return res.redirect("/profile");
  }
  next();
}

function ensureUserIsLoggedIn(req, res, next) {
  if (!req.session.currentUser) {
    return res.redirect("/login");
  }
  next();
}

function ensureUserIsSubscribed(req, res, next) {
  if (!req.session.currentUser.subscribed) {
    return res.redirect("/subscribe");
  }
  next();
}

module.exports = {
  ensureUserIsLoggedIn,
  ensureUserIsLoggedOut,
  ensureUserIsSubscribed,
};
