const User = require("../models/User.model");

module.exports.profile = (req, res, next) =>{
    res.render("users/main");
}

module.exports.private = (req, res, next) =>{
    res.render("users/private");
}

module.exports.delete = (req, res, next)=>{
    User.findByIdAndDelete(req.params.id)
     .then(()=>{
        res.redirect("/panel")
     })
     .catch((err) => next(err));
};