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

//desde aquí, checar nombres
exports.viewLogin = async (req, res) => {
	res.render("auth/login")
}

exports.login = async (req, res) => {

	try {
	// 1. OBTENCIÓN DE DATOS DEL FORMULARIO
	const username = req.body.username
	const password = req.body.password
	
	// 2. VALIDACIÓN DE USUARIO ENCONTRADO EN BD
	const foundUser = await User.findOne({ username })

	if(!foundUser){
		res.render("auth/login", {
			errorMessage: "Email o contraseña sin coincidencia."
		})

		return
	}

	// 3. VALIDACIÓN DE CONTRASEÑA
	// COMPARAR LA CONTRASEÑA DEL FORMULARIO (1) VS LA CONTRASEÑA DE LA BASE DE DATOS (2)

	const verifiedPass = await bcryptjs.compareSync(password, foundUser.passwordEncriptado)

	if(!verifiedPass){
		res.render("auth/login", {
			errorMessage: "Email o contraseña errónea. Intenta nuevamente."
		})

		return
	}

	// 4. GENERAR LA SESIÓN
	req.session.currentUser = {
		_id: foundUser._id,
		username: foundUser.username,
		mensaje: "Usuario engalletado!!"
	}

	// 5. REDIRECCIONAR AL HOME
	res.redirect("/") //¿tengo la view de profile? crearla


	} catch (error) {
		console.log(error)	
	}
}

exports.logout = async (req, res)  => {

	req.session.destroy((error) => {

		// SE EVALUÁ SI HUBO UN ERROR AL BORRAR LA COOKIE
		if(error){
			console.log(error)
			return
		}

		// REDIRECCIONAR HACIA LA PÁGINA DE HOME
		res.redirect("/")

	})

}