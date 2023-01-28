module.exports.isAuthenticated= ( req,res,next) => {
    // para saber si esta autenticado
    const autheticated = true;
    if (autheticated) {
        next() 
    } else {
        res.redirect("/login")
    }
}
module.exports.isNotAuthenticated= ( req,res,next) => {
    // para saber si esta autenticado
    const autheticated = false;
    if (!autheticated) {
        next()
    } else {
        res.redirect("/")
    }
}