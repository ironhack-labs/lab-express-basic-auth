const isLoggedOut = (req, res, next) => {
  console.log("Not supposed to enter here !");
  if (req.session.currentUser) {
    return res.redirect("/");
  }
  next();
};

module.exports = isLoggedOut;
