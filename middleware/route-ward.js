const logueado = (req, res, next) =>{
    if(!req.session.currentUsr){
        res.redirect('/login')
        return
    }
    next()

}

module.exports = {logueado}