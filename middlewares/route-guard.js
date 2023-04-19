function isLoggedIn(req, res, next) {
	// Check if user is logged in
	if (!req.session.user) {
    return res.redirect("/auth/login")
	} 
  
  // User is logged in => Open requested page 
  next()
}

module.exports = {
  isLoggedIn
}