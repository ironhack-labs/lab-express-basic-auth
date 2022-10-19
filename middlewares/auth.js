const isLogged = (req,res,next) => {
    if (req.sesion.activeUser === undefined){
        res.redirect ('/auth/login')
    }else {
        next()
    }
}

module.exports = {
    isLogged
}