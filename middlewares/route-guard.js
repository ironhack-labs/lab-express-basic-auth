
//AREAS PRIVADAS - EL USUARIO DEBE ESTAR LOGEADO PARA ACCEDER
const usuarioLoggeado = (req,res,next) =>{

    //Evaluar si el usuario esta loggeado
    //Si NO esta loggeado enviarlo a Login
    if (!req.session.currentUser) {
        res.redirect("/auth/login")
        return
    }
    //Si esta logeado enviarlo a la siguiente funcion (CONTROLLER -> /perfil)
    next()
}

//AREAS DE AUTENTICACION - EL USUARIO YA SE AUTENTICO Y QUIERE ENTRAR A LAS AREAS DE SIGNUP Y LOGIN. POR LO TANTO LO REDIRIGIMOS AL HOME
const usuarioNoLoggeado = (req,res,next) =>{

    //EVALUAR SI ESTA AUTENTICADO
    //SI ESTA AUTENTICADO...
    if (req.session.currentUser) {
        return res.redirect("/")   
    }
    // SI NO ESTÁ AUTENTICADO, DÉJALO PASAR AL SIGNUP O LOGIN
    next()
}



//EXPORT
module.exports = {
    usuarioLoggeado,
    usuarioNoLoggeado
}
