const exposeUsers = (req, res, next)=>{
    if(req.session.currentUser){
    res.locals.currentUser = req.session.currentUser;
    res.locals.isLoggedIn = true;
    }
    next();
};
module.exports = exposeUsers;