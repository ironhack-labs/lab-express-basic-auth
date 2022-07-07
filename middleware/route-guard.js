const isLoggedIn = (req, res, next) =>{
    if (!req.session.currentUser) {
        res.redirect('/login');
        return;
    }
    next();
};

const isLoggedOut = (req, res, next) =>{
    if (req.session.currentUser){
        res.redirect('/')
        return;
    }
    next();
};

module.exports = {
    isLoggedOut,
    isLoggedIn
};