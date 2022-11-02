const isLoggedIn = (req, res, next) => {
  if(!req.session) {
    return res.redirect('/login');
  }
  next();
};

//Tem um erro aqui. Mas não soube resolver. O problema resolveu quando eu apaguei .user, 
//mas deu erro em outras partes :( 
const isLoggedOut = (req, res, next) => {
  if(req.session) {
    return res.redirect('/');
  }
  next();
};

module.exports = { isLoggedIn, isLoggedOut };