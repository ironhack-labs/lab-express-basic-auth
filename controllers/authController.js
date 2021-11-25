const User = require("./../models/User.model")
const bcryptjs = require("bcryptjs")

exports.viewRegister = (req, res) => {
    res.render("auth/signup")
}

exports.register = async (req, res) => {
    const username = req.body.username
    const password = req.body.password


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

//encripción de contraseña

try{
    const salt = await bcryptjs.genSalt(10)
    const passwordEncriptado = await bcryptjs.hash(password, salt)

    const newUser = await User.create({
        username,
        passwordEncriptado
    })
    console.log(newUser)

    //redirección
    res.redirect("/")
} catch (error) {
    console.log(error)
    res.status(500).render("auth/signup", {
        errorMessage: "Hubo un error"

    })
}


}
