module.exports = (req,res,next) => {
    //checar si el usuario esta loggeado yquieereentrar a alguna seccion
    if(!req.session.currentUser){
        return res.redirect("/auth/signup")
    }
    next()
}