const isAuthenticated = (req, res, next) => {
    if(!req.session.user){
      res.redirect('/login');
      return;
    } else {
      next();
    }
  }
  
  const isNotAuthenticated = (req, res, next) => {
    if(req.session.user){
      res.redirect('/')
      return;
    } else {
      next();
    }
  }
  
  module.exports = {
    isAuthenticated,
    isNotAuthenticated
  }