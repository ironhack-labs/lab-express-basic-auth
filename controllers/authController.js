const bcryptjs	    	= require("bcryptjs")
const mongoose          = require('mongoose')
const User              = require ("./../models/User.model")


exports.signUp = (req, res) =>{
    res.render("auth/signUp")
}


exports.signUpForm = async (req, res) => {

	// 1. VERIFICAR QUE LOS DATOS DEL FORMULARIO LLEGUEN AL CONTROLLER
	const { username, password } = req.body


	// --- VALIDACIONES ---
	// A. VERIFICAR QUE NO HAYA ESPACIOS VACÍOS
	if(!username || !password){

		return res.render("auth/signUp", {
			errorMessage: "All fields are required."
		})
	}	

	// B. QUE LA CONTRASEA SEA SÓLIDA (Al menos 6 caracteres, un número, una minúscula y una mayúscula)
	const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

	if(!regex.test(password)){
		
		return res.render("auth/signUp", {
			errorMessage: "This password must be at least 6 characters, at least 1 number, at least 1 lowercase, at least 1 uppercase."
		})

	}



	// 2. ENCRIPTAR CONTRASEÑA
	// A. ¿Cuántas veces vamos a revolver la contraseña?
	const salt = await bcryptjs.genSalt(10)

	// B. Revolver la contraseña con el "salt"
	const hashedPassword = await bcryptjs.hash(password, salt)

	// C. GUARDAR EN BASE DE DATOS

	try {
		const newUser = await User.create({
			username,
			password: hashedPassword
		})
	
		console.log(newUser)
	
		return res.redirect("/signIn")

	} catch (error) {
		
		console.log(error)

		console.log(error.errors)

		// CONFIRMAR SI EL ERROR VIENE DE BASE DE DATOS
		if (error instanceof mongoose.Error.ValidationError){
			
			return res.render("auth/signUp", {
				errorMessage: "Use a real email adress please."
			})
		}

		return

	}
	

}