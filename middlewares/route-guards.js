


// 1. AREAS PRIVADAS = para que el usuario pueda acceder debe estar logeado

const usuarioLoggeado = (req, res, next) => {

    // Se evalua si el usuario esta logeado, de no hacerlo mandarlo a la pagina de login
    if(!req.session.currentUser){
        res.redirect("/auth/login")
        return
    }

    // Si esta logeado, enviarlo a la siguiente funcion con el next (Simplemente se declara)
    next()

}



// 2. AREA DE AUTENTIFICACION 
// Una vez que el usuario este logeado, y quiere entrar a las areas de signup y login, por lo tanto lo redirijimos al home

const usuarioNoLoggeado = (req, res, next) => {


    // Evaluar si se encuentra autenticado, si lo esta ejecuta esto....
    if(req.session.currentUser){

        return res.redirect("/")

    }


    // Si no se encuentra autenticado dejalo pasar a login o sign up para que se pueda registrat
    next()

}




// 3. EXPORTACION (ROUTAS Y INDEX.JS)

module.exports = {

    usuarioLoggeado,
    usuarioNoLoggeado
}