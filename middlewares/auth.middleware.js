module.exports.auth = (req, res, next) =>{
    if (req.session.currentUser) {
        next();
    } else{
        res.redirect('/sessions/create');
    }
};

module.exports.notAuth = (req, res, next) =>{
    if (req.session.currentUser) {
        res.redirect('/');
    } else{
        next();
    }
};
