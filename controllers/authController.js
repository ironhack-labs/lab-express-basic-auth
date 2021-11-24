// Importaciones

const User = require("./../models/User.model")
const bcryptsjs = require("bcryptjs")

exports.viewRegister = (req, res) => {
    res.render("auth/signup")
}

exports.register = async (req, res) => {

    // 1. Obtención de datos del usuario

    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    // Validación 1. Que no haya espacios vacíos en el formulario.

    if(!username || !email || !password) {
        res.render("auth/signup", {
            errorMessage: "One or more of the fields are empty, check them again"
        })

        return
    }

    // Validación 2. Fortalecimiento de password.

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

    if(!regex.test(password)){
        res.render("auth/signup", {
            errorMessage: "Your password must contain 6 characters, at least one number and one uppercase."
        })

        return
    }

    // Validación 3. Verificación de email.

    try {

        const salt = await bcryptsjs.genSalt(10)
        const passwordEncriptado = await bcryptsjs.hash(password, salt)
        
        const newUser = await User.create({
            username,
            email,
            passwordEncriptado
        })

        console.log(newUser)

        res.redirect("/")

    } catch (error) {
        console.log(error)
        res.status(500).render("auth/signup", {
            errorMessage: "There was an error with the validation of your mail, try again, do not leave spaces and use lowercase" 
        })
    }

}