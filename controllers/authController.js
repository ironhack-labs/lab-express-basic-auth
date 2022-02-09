const bcryptjs = require("bcryptjs")
const async = require("hbs/lib/async")


const User = require("./../models/User.model")

exports.register = (req, res) => {

    res.render("auth/register")

}

exports.registerForm = async (req, res) => {
    
    const { username, password }= req.body

    if(!username || !password){
        return res.render("auth/register", {
            errorMessage: "Porfavor llene todods los campos"
        })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    try {
        const newUser = await User.create({
            username,
            password: hashedPassword
        })
        console.log(newUser)
        return res.redirect("/profile")

    } catch (error) {
        console.log(error)

    }
}

exports.login = (req, res) => {
    res.render("auth/login")
}

exports.loginForm = async ( req, res) =>{

    console.log(req.body)

    const { username, password} = req.body

    const foundUser = await User.findOne({ username })

    if(!foundUser){

        res.render("auth/login", {
            errorMessage: "Username o contraseña incorrecta"
        })
        return
    }

    const verifiedPass = await bcryptjs.compareSync(password, foundUser.password)

    if(!verifiedPass){

        res.render("auth/login", {
            errorMessage:"Username o contraseña incorrecta"
        })
        return

    }

    req.session.currentUser = {
        _id: foundUser._id,
        username: foundUser.username,
        msg: "Este es tu ticket"
    }

    return res.redirect("/profile")
}