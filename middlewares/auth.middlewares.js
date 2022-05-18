module.exports = {
  isLoggedIn: (req, res, next) => {
    // check if currentUser exists
    if (req.session.currentUser) {
      next();
    } else {
      return res.redirect("/auth/login");
    }
  },
};
