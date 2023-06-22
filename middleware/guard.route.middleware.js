const isLoggedIn = (req, res, next) => {
    console.log(req.session.currentUser)
    if(!req.session.currentUser){
        return res.redirect('/login');
    }else if(req.session.currentUser){
        req.app.locals.isLoggedIn = true;
    }else{
        req.app.locals.isLoggedIn = false;
    }
    next()
}

const isLoggedOut = (req, res, next) =>{
    console.log(req.session.currentUser)
    if(req.session.currentUser){
        req.app.locals.isLoggedIn = false;
        return res.redirect('/profile')
    }
    next()
}

module.exports = {
    isLoggedIn,
    isLoggedOut
}