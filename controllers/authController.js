// ./controllers/authController.js

const User		= require("./../models/User.model")
const bcryptjs = require("bcryptjs")



exports.viewRegister = (req, res) => {

	res.render("auth/signup")

}

exports.register = async (req, res) => {

	// 1. OBTENCIÓN DE DATOS DEL FORMULARIO
	const username 	= req.body.username
	const password 	= req.body.password

    // => A) VALIDACIÓN - VERIFICACIÓN DE CAMPOS VACÍOS
	// VERIFICAR QUE USERNAME, EMAIL Y PASSWORD TENGAN CONTENIDO. 
	// ES DECIR QUE NO LLEGUEN VACÍOS.
	if(!username || !password){
		res.render("auth/signup", {
			errorMessage: "Uno o más campos están vacíos. Revísalos nuevamente."
		})

		return
	}


	// => B) VALIDACIÓN - FORTALECIMIENTO DE PASSWORD
	// VERIFIQUE QUE EL PASSWORD TENGA 6 CARACTERES, 
	// MÍNIMO UN NÚMERO Y UNA MAYÚSCULA.
	/* const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

	if(!regex.test(password)){

		res.render("auth/signup", {
			errorMessage: "Tu password debe de contener 6 caracteres, mínimo un número y una mayúscula."
		})	

        return
	} */


   
    // 2. ENCRIPTACIÓN DE PASSWORD 🚩🚩🚩

	const salt = await bcryptjs.genSalt(10)
	const passwordEncriptado = await bcryptjs.hash(password, salt)
	
	const newUser = await User.create({
		username,
		password: passwordEncriptado
	}) 

	console.log(newUser)
	
	// 3. REDIRECCIÓN DE USUARIO
	res.redirect("/")

}