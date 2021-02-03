const mongoose = require('mongoose')
const User = require("../models/User.model")

module.exports.index = (req, res, next) => res.render('index')