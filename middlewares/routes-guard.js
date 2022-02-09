// ./middlewares/route-guard.js

// AREAS DE AUTENTICACIÓN - EL USUARIO YA SE AUTENTICÓ Y QUIERE ENTRAR A SIGNUP Y LOGIN. POR LO TANTO LO REDIRIGIMOS AL HOME 
exports.authAreas = (req, res, next) => {

	if(req.session.currentUser){

		return res.redirect("/")

	}

	next()
}

exports.privateAreas = (req, res, next) => {

    if(!req.session.currentUser){
        res.redirect("/auth/login")
        return
    }
    next()
} 