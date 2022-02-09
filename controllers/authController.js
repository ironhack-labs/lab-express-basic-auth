const bcryptjs	    	= require("bcryptjs")
const res = require("express/lib/response")
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
	
		return res.redirect("/auth/login")

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
		msg: "This is your ticket"
	}

	// 5. REDIRECCIÓN AL PROFILE
	return res.redirect("/profile")

}