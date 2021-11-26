

const User = require("./../models/User.model")
const bcryptjs = require("bcryptjs")

exports.viewRegister = (req, res) => {

    res.render("auth/signup")

}

exports.register = async (req,res)=> {

//1. OBTENCION DE DATOS DEL FORMULARIO
const username = req.body.username
const password = req.body.password

// A)VALIDACION- VERIFICACION DE CAMPOS VACIOS, Y QUE TENGAN CONTENIDO

if(!username || !password){
    res.render("auth/signup", {
        errorMessage: "Uno o mas campos estan vacios. Revisalos nuevamente."
    })
    return
}
// B)VALIDACION - FORTALECIMIENTO DEL PASSWORD
// VERIFIQUE QUE EL PASSWORD TENGA 6 CARACTERES, 
	// MÍNIMO UN NÚMERO Y UNA MAYÚSCULA.
	// REGEX - CONJUNTO DE REGLAS QUE AUDITAN UN TEXTO PLANO
const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

if(!regex.test(password)){
    res.render("auth/signup",{
        errorMessage: "Tu password debe de contener 6 caracteres, minimo un numero y una mayuscula."

    })

    return
}

// 2. ENCRIPTACION DE PASSWORD

    try {
        const salt = await bcryptjs.genSalt(10)
        const passwordEncriptado = await bcryptjs.hash(password,salt)

        const newUser = await User.create({
            username,
            passwordEncriptado


        })

        console.log(newUser)

        res.redirect("/auth/login")
    }catch (error){


        console.log(error)

        res.status(500).render("auth/signup",{
            errorMessage: "Hubo un error con la validez de tu nombre de usuario. Intenta nuevamente. No dejes espacios y usa minusculas"
        })


    }


}

exports.viewLogin = async (req, res) => {

    res.render("auth/login")


}

exports.login = async (req, res) => {

    try{
    // 1. OBTENCION DE DATOS DEL FORMULARIO
    const username = req.body.username
    const password = req.body.password

    // 2. VALIDACION DE USUARIO ENCONTRADO EN BD
    const foundUser = await User.findOne({username})

    if(!foundUser){
        res.render("auth/login",{
            errorMessage: "Usuario o contrasena sin coincidencia"
        })
        return
    }

    // 3. VALIDACION DE CONTRASENA
    //COMPARAR LA CONTRASENA DEL FORMULARIO
    // (1) VS LA CONTRASE;A DE LA BASE DE DATOS

    const verifiedPass = await bcryptjs.compareSync(password, foundUser.passwordEncriptado)

    if(!verifiedPass){
        res.render("auth/login", {
            errorMessage: "Usuario o contrasena erronea. Intenta nuevamente."
        })
        return
    }

    // 4. GENERAR LA SESION
    //PERSISTENCIA DE IDENTIDAD
    req.session.currentUser = {
        _id: foundUser._id,
        username: foundUser.username,
        mensaje: "LO LOGRAMOS"

    }

    //5. REDIRECCIONAR AL HOME
    res.redirect("/users/profile")

    } catch (error) {
        console.log(error);
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