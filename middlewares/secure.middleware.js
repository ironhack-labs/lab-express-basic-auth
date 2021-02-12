// Estamos protegiendo que no puedas acceder desde el navegador a la url /profile manualmente sin antes autenticarte
module.exports.isAuthenticated =(req, res,next) => {
    if(req.session.currentUserId) {
        next()

    }else {
        res.redirect('/login')
    }

}

module.exports.isNotAuthenticated =(req, res,next) => {
    if(req.session.currentUserId){
        res.redirect('/profile')

    }else {
        next()
    }
}