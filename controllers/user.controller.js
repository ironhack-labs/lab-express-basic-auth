const User = require("../models/User.model");

module.exports.profile = (req, res, next) => {
    res.render("users/profile")
}

module.exports.funnyCat = (req, res, next) => {
    res.render("main")
}

module.exports.private = (req, res, next) => {
    res.render("private")
}