const User = require("./../models/User.model")
const bcryptjs = require("bcryptjs")

exports.viewRegister = (req, res) => {
    res.render("auth/signup")

}

exports.register = async(req,res) =>{
        
    //1.Obtener datos del FORMS:
    const username  = req.body.username
    const password     = req.body.password
    console.log(username, password) 






//Validación de campos

if(!username || !password){
    res.render("auth/signup", {
        errorMessage: "Campo vació"
    })
    return
}

// => Validación password. Password 6 caracteres.
// 6 caracteres
// número y mayúscula

const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

if(!regex.test(password)){
    res.render("auth/signup", {
        errorMessage: "Tu contraseña debe de contener 6 caracteres, mínimo un número y una mayúscula"
    })
    return
}

// encriptación de contraseña

try{
    const salt = await bcryptjs.genSalt(10)
    const passwordEncriptado = await bcryptjs.hash(password, salt)

    const newUser = await User.create({
        username,
        passwordEncriptado
    })
    console.log(newUser)

    //redirección
    res.redirect("/auth/login")
} catch (error) {
    console.log(error)
    res.status(500).render("auth/signup", {
        errorMessage: "Hubo un error"

    })
}
}



exports.viewLogin = async (req, res) => {
	res.render("auth/login")
}

exports.login = async (req, res) => {

    try{
        //Obtención de datos
        const username = req.body.username
        const password = req.body.password

        //Validación de username con BD
        const foundUser = await User.findOne({username})
        
        if(!foundUser){
            res.render("auth/login", {
                errorMessage: "Usuario y contraseña sin coincidencia"
            })
            return
        }
        //Validación de contraseña con BD
        const verifiedPass = await bcryptjs.compareSync(password, foundUser.passwordEncriptado)

        if(!verifiedPass){
            res.render("auth/login", {
                errorMessage: "Usuario y contraseña sin coincidencia"
            })
            return
        }
        //generar la sesión
        //presencia de identidad
        // req.session.currentUser = {
        //     _id: foundUser._id,
        //     username: foundUser.username,
        //     username: foundUser.username,
        //     mensaje: "por fa diosito"
            
        // }
        //redirección a home
        res.redirect("/users/profile")

    } catch (error) {
        console.log(error)
    }
    
}


// exports.logout = async (req, res)  => {

// 	req.session.destroy((error) => {

// 		// SE EVALUÁ SI HUBO UN ERROR AL BORRAR LA COOKIE
// 		if(error){
// 			console.log(error)
// 			return
// 		}

// 		// REDIRECCIONAR HACIA LA PÁGINA DE HOME
// 		res.redirect("/")

// 	})

// }
