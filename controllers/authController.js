//-------------------  IMPORTACIONES --------------------//
const User = require("./../models/User.model")
const bcryptjs = require("bcryptjs")



//-----------------  ROUTE CONTROLLERS  ------------------//
//1. CREAR USUARIO
exports.viewRegister = (req, res) => {
    res.render("auth/signup")
}


exports.register = async (req, res) => {
    //PASO 1: OBETENER DATOS DEL FORM
    const username = req.body.username
    const mail = req.body.mail
    const password = req.body.password


    //validación 1: datos completos
    if(!username || !mail || !password) {
        res.render("auth/signup", {
            errorMessage: "Uno o más campos están vacíos. Revisa nuevamente"
        })
        return
    }

    //validacion 2: Fortalecer pswd
    const regex =  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
    if (!regex.test(password)) {
        res.render("auth/signup", {
            errorMessage: "Tu contraseña debe tener mínimo 6 caracteres, 1 número y una mayúscula"
        })
        return
    }

    //PASO2: ENCRIPTAR PASSWORD ¡IMPORTANTE!
    try {
        const salt = await bcryptjs.genSalt(10)
        const passwordEncriptado = await bcryptjs.hash(password, salt)

        const newUser = await User.create({
            username,
            mail,
            passwordEncriptado
        })

        // PASO3: REDIRIGIMOS AL USUARIO A HOME
        res.redirect("/")
    } catch (error) {

        res.status(500).render("auth/signup", {
            errorMessage:  "Hubo un error con la validez de tu correo. Intenta nuevamente con uno diferente"
        })
    }
}


//2. INICIAR SESIÓN
exports.viewLogin = async (req, res) => {
    res.render("auth/login")
}

exports.login = async (req, res) => {
    try {
        //paso 1: obtención de datos en formulario
        const mail = req.body.mail
        const password = req.body.password

        //paso2: verificación de existencia de usuario
        const foundUser = await User.findOne({mail})
        if(!foundUser) {
            res.render("auth/login", {
                errorMesage: "Email o contraseña sin coincidencias"
            })
            return
        }
        //paso 3: validar contraseña
        const verifiedPass = await bcryptjs.compareSync(password, foundUser.passwordEncriptado)
        if(!verifiedPass) {
            res.render("auth/login", {
                errorMessage: "Email o contraseña errónea. Intenta de nuevo"
            })
            return
        }
        //paso 4: generar la sesión con cookie
        req.session.currentUser = {
            _id: foundUser._id,
            username: foundUser.username,
            mail: foundUser.mail,
            mensaje: "You are finally in!"
        }

        //paso 5: redireccionar a home
        res.redirect ("/users/profile")
    } catch(error) {
        console.log(error)
    }
}


//CERRAR SESIÓN
exports.logout = async (req, res) =>  {
    req.session.destroy((error) => {
        if(error) {
            console.log(error)
            return
        }
        res.redirect("/")
    })
}
