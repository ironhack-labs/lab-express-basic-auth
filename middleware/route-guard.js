const req = require("express/lib/request")

const isLogged = (req,res,next) => {
    if(!req.session.currentUser){
        return res.redirect("/login")
    }
    next();
}

const isLoggedOut = (req,res,next) => {
    if(req.session.currentUser){
        return res.redirect("/userProfile")
    }
    next()
}

module.exports = {
    isLogged,
    isLoggedOut
}