const User = require("./../models/User.model")
const bcryptjs = require("bcryptjs")

exports.viewRegister = (req, res) => {
	res.render("auth/signup") //cuando haces un render, renderizas el hbs, entonces ne
}

exports.register = async (req,res) => {
    const username = req.body.username
    const password = req.body.password
    const salt = await bcryptjs.genSalt(10)
        const passwordEncriptado = await bcryptjs.hash(password, salt)
        
        const newUser = await User.create({
            username,
            passwordEncriptado
        }) 
        res.redirect("/")
}