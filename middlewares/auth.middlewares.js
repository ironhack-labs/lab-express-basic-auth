//creamos un middleware para saber si está o no autentificado y dependiendo de si está o no podrá ver/hacer x cosas

module.exports.isAuthenticated = (req, res, next) => {
    if (req.currentUser) {
      next();
    } else {
      res.redirect('/login');
    }
  };
  
  module.exports.isNotAuthenticated = (req, res, next) => {
    if (req.currentUser) {
      res.redirect('/user/profile');
    } else {
      next();
    }
  };