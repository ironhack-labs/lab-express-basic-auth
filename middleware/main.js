function main(req, res, next) {
    if (!req.session.currentUser) {
      res.redirect("/");
      return;
    }
  
    next(); // next mean, if user is there, go to next (meaning the ) 
  }

  module.exports = main