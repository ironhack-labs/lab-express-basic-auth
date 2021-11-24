// Importaciones

const User = require("./../models/User.model")
const bcryptsjs = require("bcryptjs")

exports.viewRegister = (req, res) => {
    res.render("auth/signup")
}