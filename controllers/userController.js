const bcryptjs		= require("bcryptjs")
const mongoose		= require("mongoose")

const User			= require("./../models/model.users.js")

exports.register = (req, res) => {

	res.render("users/register.hbs")

}

exports.registerForm = async (req,res) => {

    const { username, password, newsletter } = req.body



}