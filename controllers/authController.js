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

exports.loginForm = async (req, res) => {

	console.log(req.body)

	// 1. OBTENCIÓN DE DATOS DEL FORMULARIO
	const { email, password } = req.body

	// 2. VALIDACIÓN DE USUARIO ENCONTRADO EN BD

	const foundUser = await User.findOne({ email })

	if(!foundUser){

		res.render("auth/login", {
			errorMessage: "Email o contraseña sin coincidencia."
		})

		return
	}

	// 3. VALIDACIÓN DE CONTRASEÑA

	const verifiedPass = await bcryptjs.compareSync(password, foundUser.password)

	if(!verifiedPass){

		res.render("auth/login", {
			errorMessage: "Email o contraseña incorrecta."
		})

		return

	}

	// 4. GESTIÓN DE SESIÓN. SI LA CONTRESEÑA COINCIDE ENTONCES CREAR UN RECORDATORIO (COOKIE) EN EL NAVEGADOR DE QUE SÍ ES EL USUARIO

	req.session.currentUser = {
		_id: foundUser._id,
		username: foundUser.username,
		email: foundUser.email,
		msg: "Este es su ticket"
	}

	// 5. REDIRECCIÓN AL PROFILE
	return res.redirect("/profile")


}