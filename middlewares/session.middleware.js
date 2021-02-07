const User= require("../models/user.model")

module.exports.findUser = (req,res,next) => {
    if(req.session.currentUserId){
        User.findById(req.session.currentUserId)
            .then((user) => {
                if(user){
                    req.currentUser = user
                    res.locals.currentUser = user //To access the content on any view
                    next()
                }
                else{
                    next()
                }
            })
            .catch(e => next(e))
    }
}