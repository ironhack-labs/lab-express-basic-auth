const isUser = (req, res, next) => {
    console.log('---VAMOS A COMPROBAR LA SESIÓN---->', req.session)
    !req.session.currentUser ? res.render('authentication/login', { errorMessage: 'Unauthorized' }) : next()
}

const isNoUser = (req, res, next) => {
    req.session.currentUser ? res.redirect('/') : next()
}


module.exports = { isUser, isNoUser }