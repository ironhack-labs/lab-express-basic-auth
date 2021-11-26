//1. IMPORT:
const User = require("./../models/User.model")
//Libreria para encriptar (npm install bcryptjs)
const bcryptjs = require("bcryptjs")


//--------------Ruta de View y Form-------------------
//VIEW
exports.viewRegister = async(req,res) =>{
    res.render("auth/signup")
}

//-------------------FORMS OF SIGNUP--------------------
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
        errorMessage: "Hubo un error 500"
    }) 
 }
}
//-------------------VIEW OF LOGIN--------------------
exports.viewLogin = async(req,res) =>{
    res.render("auth/login")
}

//-------------------FORMS OF LOGIN--------------------

exports.login = async(req,res) =>{

    try {
        //1. OBTENER DATOS DEL FORM
        const username  = req.body.username
        const password     = req.body.password

        //2. VALIDACION DE USUARIO
        const foundUser = await User.findOne({ username })
        console.log(foundUser) // <-- Manda todos los datos del usuario (objeto)
        if(!foundUser){
            res.render("auth/login", {
                errorMessage: "Email o contraseña no tienen nada que ver, como un 🥪  y una 🍎 en un dia soleado"
            })
            return
        } //probar form ponerlo en blanco

        //3. VALIDACION DE CONTRASEÑA -- COMPRAR LA CONTRASEÑA DEL FORMULARIO vs.. LA BD
        const verifiedPass = await bcryptjs.compareSync(password, foundUser.passwordEncriptado)
        if (!verifiedPass) {
            res.render("auth/login",{
                errorMessage: "Email o contraseña errónea, try again 😅"
            })
            return
        }

        //4. GENERAR LA SESION - DESDE EL SERVIDOR MANDAMOS COOKIE 
        //PERSISTENCIA DE IDENTIDAD (ARCHIVO QUE CONTIENE LA INFO DEL USUARIO)
        req.session.currentUser = {
            _id: foundUser._id,
            username: foundUser.username,
            mensaje: "BIENVENIDO A LA SESION DENTRO DE MONGODB"
        }
        //**Dentro de MONGODB👇*/

        //5. REDIRECCIONAR AL PERFIL
        res.redirect("/users/main")


    } catch (error) {
        console.log(error)
    }

}


//--------------------------LOGOUT------------------------
//Session en MONGO DB no aparece
exports.logout = async(req,res) =>{
    req.session.destroy((error) =>{
        //Se evalua so Hubo un error al borrar la cookie
        if (error) {
            console.log(error)
            return
        }
        res.redirect("/")
    })
}


//**Dentro de MONGODB👇*/
/* _id: "anjPPIlx9A5HnhV7adBB6kSFYzL4HskX"
expires: 2021-11-27T03:16:20.408+00:00 
Datesession:{
    "cookie":{
        "originalMaxAge":86400000,
        "expires":"2021-11-27T03:16:20.408Z",
        "httpOnly":true,
        "path":"/"},
    "currentUser":{
        "_id":"61a00bc88392f50016f6a17b",
        "username":"HolaMundoRod",
        "mensaje":"BIENVENIDO A LA SESION DENTRO DE MONGODB"}}
 */