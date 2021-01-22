const mongoose = require('mongoose');

module.exports.home = (req, res, next) => {
    res.render("index");
}

module.exports.main = (req, res, next) => {
    res.render('main');
}

module.exports.private = (req, res, next) => {
    res.render('private');
}