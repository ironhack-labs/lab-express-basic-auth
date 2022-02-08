const bcryptjs = require("bcryptjs")
const mongoose = require("mongoose")
const User = require("./../models/User")

//render register
exports.register = (req, res) => {
	res.render("auth/signup")
}

//render registerForm
exports.registerForm = async (req, res) => {
	const { username, password } = req.body

	if(!username || !password){
		return res.render("auth/signup", {
			errorMessage: "Todos los campos deben llenarse."
		})
	}	

	//regex 6 caracteres, un número, una minúscula y una mayúscula)
	const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

	if(!regex.test(password)){
		return res.render("auth/signup", {
			errorMessage: "Tu contraseña debe incluir 6 caracteres, al menos un número, una minúscula y una mayúscula."
		})
	}

	const salt = await bcryptjs.genSalt(10)
	const hashedPassword = await bcryptjs.hash(password, salt)

	try {
		const newUser = await User.create({
			username,
			password: hashedPassword
		})
		console.log(newUser)
		return res.redirect("/profile")
	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError){
			return res.render("auth/signup", {
				errorMessage: "Por favor revisa tu informacion."
			})
		}
		return
	}
}



