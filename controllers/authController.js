// En este archivo se generan las funciones para mis rutas (Register, etc)



// 1. IMPORTACIONES

// MODELO: del usuario 
const User		= require("./../models/User")

// BCRYIPY: Para poder utilizarlo en la encriptacion de mis contraseñas (Npm install bcryptjs )
const bcryptjs = require("bcryptjs")


// ViewRegister: simplemente genera la vista para el registro de usuario
exports.viewRegister = (req, res) => {

	res.render("auth/signup")

}

// Register: genera funciones para registrar al usuario, encriptar contraseña, validaciones minimas (Regex), crear usuario
exports.register = async (req, res) => {

	// 1. OBTENER los DATOS del FORMULARIO que llena mi usuario al registrarse
	const username 	= req.body.username
	const email 	= req.body.email
	const password 	= req.body.password


	
	// A) Validacion: verificar NO haya campos vacios al enviar formulario (Username, email, contraseña)
	if(!username || !email || !password){
		res.render("auth/signup", {
			// Si esta alguno vacio muestra este mensaje
			errorMessage: "Uno o más campos están vacíos. Revísalos nuevamente."
		})

		// Necesario para no quedarse colgado, y que me regrese un valor
		return
	}


	
	// B) Validacion: Fortalecer contraseña (Min caracteres, min un numero, min mayuscula) 
	// REGEX: La validacion de seguridad se realiza con regex (Conjunto de reglas y parametros que revisan la contraseña cumpla con requisitos minimos)
	
	// Requisitos minimos se establecen en esta linea a tarves de regex
	const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/


	// Revisar si contraseña pasa el test de regex (Con los paramteros minimos establecidos x seguridad)
	if(!regex.test(password)){
		
		res.render("auth/signup", {
			errorMessage: "Tu password debe de contener 6 caracteres, mínimo un número y una mayúscula."
		})		

		// Para que me regrese un valor y no se quede colgado
		return
	}





	// 2. ENCRIPTACIÓN DE PASSWORD

	
	try {

		// Con la contraseña genera una sopa de letras y numeros, 10 veces, y devuelve un valor aleatorio que identifica a mi contraseña (HASH IRREVERSIBLE)
		const salt = await bcryptjs.genSalt(10)

		// Guardamos en una variable la contraseña encriptada, la cual sera enviada a la base de datos.
		const passwordEncriptado = await bcryptjs.hash(password, salt)
		
		// Creacion de un nuevo usuario con sus requisitos, y la contraseña ya ENCRIPTADA (para enviar a Mongo)
		const newUser = await User.create({
			username,
			email,
			passwordEncriptado
		}) 

		console.log(newUser)
		
		// 3. Una vez creado el usuario me envia a incio
		res.redirect("/")

	} catch (error) {

		// Si no logra completarse el proceso de creacion, renderiza un error en el navegador.
		console.log(error)

		res.status(500).render("auth/signup", {
			errorMessage: "Hubo un error con la validez de tu correo. Intenta nuevamente. No dejes espacios y usa minúsculas."
		})

	}

}


