// Áreas privadas

const usuarioLoggeado = (req, res, next) => {
    if(!req.session.currentUser) {
        res.redirect("auth/login")
        return
    }
    next()
}

// Àreas de autenticación

const usuarioNoLoggeado = (req, res, next) => {
    if(req.session.currentUser) {
        return res.redirect("/")
    }
    next()
}

// Exportación

module.exports = {
    usuarioLoggeado,
    usuarioNoLoggeado
}