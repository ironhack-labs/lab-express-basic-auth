function main(req, res, next) {
    if (!req.session.currentUser) {
      res.render("auth/main");
      return;
    }
  
    next(); // next mean, if user is there, go to next (meaning the ) 
  }

  module.exports = main