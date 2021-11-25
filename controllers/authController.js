// ./controllers/authController.js
const User		= require("./../models/User.model")
const bcryptjs = require("bcryptjs")

exports.viewRegister = (req, res) => {
	res.render("auth/signup")
}

exports.register = async (req, res) => {

	const username 	= req.body.username
	const email 	= req.body.email
	const password 	= req.body.password
    
	if(!username || !email || !password){
		res.render("auth/signup", {
			errorMessage: "Uno o más campos están vacíos. Revísalos nuevamente."
		})
		return
	}

	const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

	if(!regex.test(password)){
		res.render("auth/signup", {
			errorMessage: "Tu password debe de contener 6 caracteres, mínimo un número y una mayúscula."
		})	
        return
	}

    // 2. ENCRIPTACIÓN DE PASSWORD 🚩🚩🚩	
	try {
		const salt = await bcryptjs.genSalt(10)
		const passwordEncriptado = await bcryptjs.hash(password, salt)
		
		const newUser = await User.create({
			username,
			email,
			passwordEncriptado
		}) 	
		// 3. REDIRECCIÓN DE USUARIO
		res.redirect("/auth/login")

	} catch (error) {
		res.status(500).render("auth/signup", {
			errorMessage: "Hubo un error con la validez de tu correo. Intenta nuevamente. No dejes espacios y usa minúsculas."
		})
	}
}

exports.viewLogin = async (req, res) => {
	res.render('auth/login')
}

exports.login = async (req, res) => {
	try {
	
	const email = req.body.email
	const password = req.body.password

	const foundUser = await User.findOne({ email })

	if(!foundUser){
		res.render("auth/login", {
			errorMessage: "Email o contraseña sin coincidencia."
		})	
		return
	}

	const verifiedPass = await bcryptjs.compareSync(password, foundUser.passwordEncriptado)

	if(!verifiedPass){
		res.render("auth/login", {
			errorMessage: "Email o contraseña errónea. Intenta nuevamente."
		})
		return
	}

	req.session.currentUser = {
		_id: foundUser._id,
		username: foundUser.username,
		email: foundUser.email,
		mensaje: "LO LOGRAMOS "
	}

	res.redirect("/users/profile")

	} catch (error) {	

		}
}

exports.logout = async (req, res) => {

	req.session.destroy((error) => {

		// SE EVALUÁ SI HUBO UN ERROR AL BORRAR LA COOKIE
		if(error){			
			return
		}
		// REDIRECCIONAR HACIA LA PÁGINA DE HOME
		res.redirect("/")
	})

}