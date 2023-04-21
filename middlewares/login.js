const isLoggedIn = (req, res, next)=>{
    if(req.session.currentUser){
        next()
    }else{
        res.render('auth/login'), {errorMessage: 'This is a private page. Login to see'}
        return
    }
}

module.exports = isLoggedIn