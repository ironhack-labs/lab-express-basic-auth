
const User		= require("./../models/User.model")
const bcryptjs = require("bcryptjs")


//Renderiza registro
exports.viewRegister = (req, res) => {

	res.render("auth/signup")

}
// permite editar y crear un registro
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
	// REGEX - CONJUNTO DE REGLAS QUE AUDITAN UN TEXTO PLANO
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
			passwordEncriptado
		}) 

		console.log(newUser)
		
		// 3. REDIRECCIÓN DE USUARIO
		res.redirect("/auth/login")

	} catch (error) {
		res.status(500).render("auth/signup", {
			errorMessage: "Intenta nuevamente. No dejes espacios y usa minúsculas."
		})

	}

	

}
// Renderiza login
exports.viewLogin = async (req, res) => {
	res.render("auth/login")
}

//permite ingresar como usuario
exports.login = async (req, res) => {
	//Implementar un manejo de errores-->try, catch
  
	try {
	  // 1. OBTENCIÓN DE DATOS DEL FORMULARIO
	  //Dos datos neceesarios para logearse: username y password
	  //Obtenerlos del body
	  const username = req.body.username;
	  const password = req.body.password;
  
	  // 2. VALIDACIÓN DE USUARIO ENCONTRADO EN BD
	  //a)buscar username en la base de datos, mediante el metodo finOne
	  const foundUser = await User.findOne({ username });
	  //qué pasa si no lo encuentra?
	  if (!foundUser) {
		//Enviar mensaje de Error y redireccionar a la pagina de login
		res.render("auth/login", {
		  errorMessage: "Usuario o contraseña sin coincidencia.",
		});
		//finaliza la funcion
		return;
	  }
  
	  // 3. VALIDACIÓN DE CONTRASEÑA
	  //comparamos el password ingresado por el user y el password de la DB
	  const verifiedPass = await bcryptjs.compareSync(
		password,
		foundUser.passwordEncriptado
	  );
  
	  if (!verifiedPass) {
		res.render("auth/login", {
		  errorMessage: "Usuario o contraseña errónea. Intenta nuevamente.",
		});
		return;
	  }
	  // 4.GENERAR LA SESIÓN
	  //PERSISTENCIA DE IDENTIDAD
	  req.session.currentUser = {
		_id: foundUser._id,
		username: foundUser.username,
		mensaje: "Identifique un inicio de sesion",
	  };
	  // 5. REDIRECCIONAR AL MAIN
	  res.redirect("/users/main");
	} catch (error) {}
  };

exports.logout = async (req, res)  => {

	req.session.destroy((error) => {

		// Prolemas con la cookie
		if(error){
			console.log(error)
			return
		}

		// redirección a Home
		res.redirect("/")

	})

}