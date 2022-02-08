const bcryptjs		= require("bcryptjs")
const mongoose		= require("mongoose")

const User			= require("../models/model.users.js")

exports.register = (req, res) => {

	res.render("register")

}

exports.registerForm = async (req,res) => {

    const { username, password, newsletter } = req.body
    //console.log(req.body)

    const salt = await bcryptjs.genSalt(10)

    const hashedPassword = await bcryptjs.hash(password, salt)

    try{
            const newUser = await User.create({
                username,
                password: hashedPassword,
                newsletter
            })

            console.log(newUser)
            return res.redirect("/register")

    } catch (error){

        console.log(error)
    }

}