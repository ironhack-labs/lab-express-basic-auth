const isPrivate =(req, res, next) =>{
    if(req.session.currentUser.isPrivate){
        return  next()
        }
    res.redirect("/profile");
};

module.exports = isPrivate;