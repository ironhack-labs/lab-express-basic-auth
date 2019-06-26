function ensureAuthenticated(req, res, next){
    if(req.session.currentUser){
        console.log("authenticated!!!!!")
        return next()
    }
    else{
        console.log("NOT authenticated")
        res.redirect('/login')}
}


module.exports=ensureAuthenticated