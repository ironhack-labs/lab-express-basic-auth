const isAdmin =(req, res, next) =>{
    if(req.session.currentUser){
        if(req.session.currentUser.isAdmin){
            next();
        }   
    }
    res.redirect("/profile");
};

module.exports = isAdmin;