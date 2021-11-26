//private areas for logged users
const loggedUser = (req, res, next)=>{
    if(!req.session.currentUser){
        res.redirect("/auth/login")
        return
    }
    next()

}

//autenticate areas: for login or signup areas to logged users,
//avoid to register again affter a first login: BASIC SECURITY

const noLoggedUser= (req, res, next)=>{
    if(req.session.currentUser){
        res.redirect("/")
        return
    }
    next()
}

module.exports = {
    loggedUser,
    noLoggedUser
}
