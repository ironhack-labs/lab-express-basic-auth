const User = require("./../models/User.model")
const bcryptjs = require("bcryptjs")

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
