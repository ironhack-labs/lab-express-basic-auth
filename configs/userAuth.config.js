const userAuth = (request, response, next) => {
  if (!request.session.currentUser) response.redirect("/login");
  next();
};

module.exports = userAuth;
