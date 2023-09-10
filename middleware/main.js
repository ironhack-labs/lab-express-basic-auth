function main(req, res, next) {
  if (!req.session.currentUser) {
    res.render("auth/main");
    return;
  }

  next(); 
}

module.exports = main;

