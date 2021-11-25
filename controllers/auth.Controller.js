//1. IMPORT:
const User = require("./../models/User.model")
//Libreria para encriptar (npm install bcryptjs)
const bcryptjs = require("bcryptjs")


//--------------Ruta de View y Form-------------------
//VIEW
exports.viewRegister = async(req,res) =>{
    res.render("auth/signup")
}

//FORMS OR LOG
exports.register = async(req,res) =>{
        
    //1.Obtener datos del FORMS:
    const username  = req.body.username
    const password     = req.body.password
    console.log(username, password) //<-- HolaMundo 12345

    //2.VALIDATION
    if (!username || !password) {
        res.render("auth/signup", {
            errorMessage: "Uno o mas campos estan vacios"
        })
        return  //termina la funcion si no existe alguno de estos datos
    }

    //B). VALIDACION (PASS)
    //Verificar que el pass tenga 6 caracteres, minimo un numero, una mayuscula.
    //https://regexr.com/ (un conjunto de texto que audita un texto)
	const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/ 
	if(!regex.test(password)){
		res.render("auth/signup", {
			errorMessage: "Tu password debe de contener 6 caracteres, solo un número y minimo una mayúscula y minuscula."
		})
		return
	}

    //2. Encriptacion de Password  🚩🚩🚩🚩
try {
    //Revolver 10 veces la password 👇 
    const salt = await bcryptjs.genSalt(10)
    const passwordEncriptado = await bcryptjs.hash(password,salt)
    
    console.log(passwordEncriptado) //<--- pass encriptado

    const newUser = await User.create({
        username,
        passwordEncriptado
    })
        console.log(newUser)
        res.redirect("/")

 } catch(error){
    res.status(500).render("auth/signup", { //Error en la base de datos
        errorMessage: "Hubo un error contraseña invalida"
    }) 
 }
}