const isLoggedIn=(req,res,next)=>{
    if(!req.session.currentUSer){
        res.redirect('login')
        return
    }
    next();
}

module.exports= {isLoggedIn}