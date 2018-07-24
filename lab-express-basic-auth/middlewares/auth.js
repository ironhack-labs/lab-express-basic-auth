const requireUser = (req, res, next) => {
    if(req.session.currentUser){
        next();
    }else{
        res.redirect('/auth/login');
    }
};

const requireAnon = (req, res, next) => {
    if(!req.session.currentUser){
        next();
    }else{
        res.redirect('/main');
        
    }
};

module.exports = {
    requireUser,
    requireAnon
};