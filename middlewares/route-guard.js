

//AREAS PRIVADAS - EL USUARIO DEBE ESTAR LOGGEADO PARA ACCEDER
const usuarioLoggeado = (req, res, next) => {
    //EVALUAR SI EL USUARIO NO ESTA LOGGEADO
    //SI NO ESTA LOGGEADO ENVIARLO A LOGIN...
    if(!req.session.currentUser){
        res.redirect("/auth/login")
        return
    }
    //SI SI ESTA LOGGEADO ENVIARLO A LA SIGUIENTE FUNCION (CONTROLLER)
    next()

}

const usuarioNoLoggeado = (req, res, next) => {

    if(req.session.currentUser){
        return res.redirect("/")
    }
    next()


}

module.exports = {
    usuarioLoggeado,
    usuarioNoLoggeado
}