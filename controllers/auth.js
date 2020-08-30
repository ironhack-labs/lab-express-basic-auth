const bcrypt = require("bcrypt")
const User = require("../models/User")

// Ahora los arhivos de controllers tienen las funciones que hacen el trabajo que corresponde a cierta ruta
// Por lo regular tendremos una ruta get para mostrar una vista
//  Y una ruta post para hacer el trabajo que deba hacerse para esa vista.

//============SIGNUP================

exports.signupView = (req, res) => res.render("/")

exports.signupProcess = async(req, res) => {
    // 1. Extraer la informacion del req.body
    const { username, email, password } = req.body
        // 2. Verificar que nos enviaron la informacion necesaria
    if (username === "" || email === "" || password === "") {
        return res.render("/", { error: "Missing fields" })
    }
    // 3. Verificamos que el usuario existe
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
        return res.render("/", { error: "Username or Email in use" })
    }
    // 4. hasheamos la contrase~a
    const salt = bcrypt.genSaltSync(12)
    const hashPwd = bcrypt.hashSync(password, salt)
        // 5. si el usuario no existe... Creamos al usuario
    await User.create({
        username,
        email,
        password: hashPwd
    })

    res.redirect("/")
}

//============LOGIN================

exports.loginView = (req, res) => {
    console.log(req.session)
    res.render("/", { counter: req.session.counter })
}
exports.loginProcess = async(req, res) => {
    // 1. Extraer la informacion del req.body
    const { email, password } = req.body
        // 2. Verificar que no nos envian campos vacios
    if (email === "" || password === "") {
        return res.render("/", { error: "Missing fields" })
    }
    // 3. Verificar si el usuario existe, si existe podemos
    // comparar las contrase~as
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
        return res.render("/", { error: "Error" })
    }
    // 4. verificar que la contrase~a es correcta
    if (bcrypt.compareSync(password, existingUser.password)) {
        // 5. hacer render del perfil del usuario
        req.session.user = existingUser
        res.redirect("/profile")
    } else {
        return res.render("/", { error: `Password doesn't match` })
    }
}