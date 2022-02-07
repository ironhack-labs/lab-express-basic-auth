const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        res.render('./auth/log-in', {message:'Tienes que iniciar sesión para ver tu perfil'})
        return
    }
    next();
}

const isLoggedInTrue = (req, res, next) => {
    if (req.session.currentUser) {
        res.render('./pages/main', {message:'Ya has iniciado sesión'})
        return
    }
    next();
}

const privateMustLogIn = (req, res,  next) => {
    if(!req.session.currentUser){
        res.render('./auth/log-in', {message:'Esta página es privada! Debes iniciar sesión'})
        return
    }
    next();
}


module.exports = {isLoggedIn, privateMustLogIn, isLoggedInTrue}