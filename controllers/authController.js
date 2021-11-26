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
            password: passwordEncriptado
        })

        console.log(newUser)

        res.redirect("/auth/login")

    } catch (error) {
        console.log(error)
        res.status(500).render("auth/signup", {
            errorMessage: "There was an error with the validation of your mail, try again, do not leave spaces and use lowercase" 
        })
    }

}

exports.viewLogin = async (req, res) => {
    res.render("auth/login")
}

exports.login = async (req, res) => {

    try {

        // 1. Obtención de datos del formulario
        const email = req.body.email
        const password = req.body.password
        const foundUser = await User.findOne ({ email })

        // 2. Validación de usuario encontrado en BD.

        if(!foundUser) {
            res.render("auth/login", {
                errorMessage: "Email or password doesn't match"
            })

            return 

        }

        // 3. Validación de contraseña con la BD. 

        const verifiedPass = await bcryptsjs.compareSync(password, foundUser.password)

        if(!verifiedPass) {
            res.render("auth/login", {
                errorMessage: "Email or password wrong. Try again"
            })

            return

        }

        // 4. Generar la sesión. Enviar una cookie al cliente.

        // a. Establecer persistencia de identidad.

        req.session.currentUser = {
            _id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email
        }

        // Redireccionar al perfil.
        res.redirect("/users/profile")
    } catch (error) {
        console.log(error)
    }
}

exports.logout = async (req, res) => {
    req.session.destroy((error) => {
        // Borrar la cookie de la BD.
        if(error) {
            console.log(error)
            return
        }
        // Redirecciona a home.
        res.redirect("/")
    })
}