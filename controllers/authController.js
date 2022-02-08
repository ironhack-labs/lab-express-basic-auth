const bcryptjs		= require("bcryptjs")
const mongoose		= require("mongoose")

const User			= require("./../models/User.model")

exports.signup = (req, res) => {
	res.render("auth/signup")
}

exports.signupForm = async (req, res) => {
	const { username, email, password } = req.body

	if(!username || !email || !password){
		return res.render("auth/signup", {
			errorMessage: "All fields are required."
		})
	}	
	const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

	if(!regex.test(password)){
		return res.render("auth/signup", {
			errorMessage: "Your password must include at least: 6 characters, one number, one lowercase and one uppercase."
		})
	}

	const salt = await bcryptjs.genSalt(10)

	const hashedPassword = await bcryptjs.hash(password, salt)

	try {
		const newUser = await User.create({
			username,
			email, 
			password: hashedPassword
		})
	
		console.log(newUser)
		return res.redirect("/profile")

	} catch (error) {
		console.log(error)
		console.log(error.errors)

		if (error instanceof mongoose.Error.ValidationError){
			return res.render("auth/signup", {
				errorMessage: "Incorrect email address."
			})
		}
		return
	}
}


exports.login = (req, res) => {
	res.render("auth/login")
}