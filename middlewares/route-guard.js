// 1.- Debe ser usuario para acceder

const usuarioLoggeado = (req, res, next) => {
    //Si no es usuario renderiza login
	if(!req.session.currentUser){
		res.redirect("/auth/login")
		return
	}
    //Si está logeado siguiente función
	next()

}

// 2.- Usuario ya autenticado si usuario quiere entrar a Signup o Login se redirige a Home

const usuarioNoLoggeado = (req, res, next) => {
    // Si ya se autenticó redirigir a Home
	if(req.session.currentUser){
		return res.redirect("/users/main")
	}

	// SI NO ESTÁ AUTENTICADO, DÉJALO PASAR AL SIGNUP O LOGIN
	next()
}

module.exports = {
	usuarioLoggeado,
	usuarioNoLoggeado
}