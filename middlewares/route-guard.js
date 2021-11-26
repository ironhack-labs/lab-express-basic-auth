// ./middlewares/route-guard.js

// ÁREAS PRIVADAS - EL USUARIO DEBE ESTAR LOGGEADO PARA ACCEDER
const usuarioLoggeado = (req, res, next) => {

	// EVALUAR SI EL USUARIO NO ESTÁ LOGGEADO
	// SI NO ESTÁ LOGGEADO ENVIARLO A LOGIN...
	if(!req.session.currentUser){
		res.redirect("/auth/login")
		return
	}

	// SI SÍ ESTÁ LOGGEADO ENVIARLO A LA SIGUIENTE FUNCIÓN (CONTROLLER)
	next()

}

// ÁREAS DE AUTENTICACIÓN - EL USUARIO YA SE AUTENTICÓ Y QUIERE ENTRAR A LAS ÁREAS DE SIGNUP Y LOGIN. POR LO TANTO LO REDIRIGIMOS AL HOME
const usuarioNoLoggeado = (req, res, next) => {

	// EVALUAR SI ESTÁ AUTENTICADO
	// SI SÍ ESTÁ AUTENTICADO...
	if(req.session.currentUser){
		return res.redirect("/")
	}

	// SI NO ESTÁ AUTENTICADO, DÉJALO PASAR AL SIGNUP O LOGIN
	next()
}

module.exports = {
	usuarioLoggeado,
	usuarioNoLoggeado
}