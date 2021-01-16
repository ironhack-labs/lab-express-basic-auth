const mongoose = require('mongoose');

module.exports.register = (req, res, next) => {
    res.render("user/register");
}