const bcryptjs      = require("bcryptjs")
const saltRounds    = 10

const User          = require("./../models/User.model")

exports.signUp = async (req, res) => {
    res.render("users/signup")
} 
//base del formulario que se va a leer con las rutas
exports.signUpForm = async (req, res) => {
    const {username, password} = req.body
    // Encriptando la contraseña
    const salt = await bcryptjs.genSalt(saltRounds)
    // MEZCLA DEL PASSWORD CON NUESTRA SALT
    const hashedPassword = await bcryptjs.hash(password, salt)

    const newUser = await User.create ({
        username: username,
        passwordHash: hashedPassword
    })
    console.log(newUser)

    res.redirect("/")
}

exports.loginUser = async (req, res) => {
    res.render("users/login")
}

exports.loginUserForm = async (req, res) => {
    const { username, password } = req.body
    if( username === "" || password === "" ) { //no espacios vacíos
        return res.render("users/login", {
            errorMessage: "Favor de llenar los campos vacíos."
        })
    }
//encontrando al usuario en nuestra base de datos...
    try {
        const foundUser = await User.findOne({ username })
        if (!foundUser) {
            return res.render("users/login", {
                errorMessage: "El usuario y/o contraseña no coinciden con la base de datos."
            })
        }                           //cotejando datos ingresados con los de la base de datos
    const isMatched = await bcryptjs.compareSync(password, foundUser.passwordHash)
                                                //se saca del req.body
    if (isMatched === false) {
        return res.render("users/login", {
            errorMessage: "El usuario y/o contraseña no coinciden con la base de datos."
        })
    }

    if (foundUser) {
        req.session.currentUser  = foundUser
        console.log(req.session.currentUser)
        return res.render("users/profile", {
            foundUser
        })
    }

    } catch (e) {
        console.log(e)
    }

}

exports.createProfile = async (req, res) => {
    res.render("users/profile", {foundUser: req.session.currentUser })
}
