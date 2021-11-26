// AREAS EXCLUSIVAS DE USUARIO LOGGEADO
const usuarioLoggeado = (req, res, next) => {
    //evaluación de usuario loggeado: no está loggeado
    if(!req.session.currentUser) {
        res.redirect("/auth/login") //redireccionar a página para que se loggeé
        return
    }
    next()
}


//AREAS DE AUTENTICACIÓN
const usuarioNoLoggeado = (req, res, next) => {
//Evaluamos si sí está loggeado
    // si sí tiene sesión iniciada
    if(req.session.currentUser) {
        return res.redirect("/")
    }
    //sino...
    next()
}

module.exports = {
    usuarioLoggeado,
    usuarioNoLoggeado
}