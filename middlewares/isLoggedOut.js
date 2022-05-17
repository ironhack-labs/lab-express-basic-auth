const isLoggedOut = (req, res, next) =>{
    if(req.session.currentUser){
        return res.redirect('/profile');
    }
     next();
};

module.exports = isLoggedOut;