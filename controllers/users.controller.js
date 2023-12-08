const User = require("../models/User.model");

module.exports.register = (req, res, next) => {
    res.render("users/register");
}; 

module.exports.doRegister = (req, res, next) => {
    User.create(req.body)
    .then(() => {
        res.redirect("/login");
    })
    .catch((err) => next(err));
};