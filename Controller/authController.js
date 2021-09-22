const bcryptjs = require('bcryptjs')
const saltRounds = 10
const User = require('./../models/User.model')


exports.createUser = async (req,res)=>{
    res.render("auth/signup")
}

exports.createUserForm = async (req,res)=>{
    const {username, password} = req.body;
    try{
    const salt = await bcryptjs.genSalt(saltRounds)
    const hashedPassword = await bcryptjs.hash(password,salt)
    const newUser = await User.create({
            username,
            password: hashedPassword
    })
    res.direct("/")
}catch(error){
    console.log("Se creo el mismo user")
    res.render("auth/signup")
}
}

exports.loginUser = async (req,res)=>{
    res.render("auth/login")
}

exports.loginUserForm = async (req,res)=>{
    const {username, password} = req.body
    if( username === "" || password === "" ){
        return res.render("auth/login", {
            errorMessage: "Tienes campos vacíos. Debes llenarlos."
        })
    }
    try {
        const foundUser = await User.findOne({username})
        if(!foundUser){
            return res.render("auth/login", {
                errorMessage: "El usuario o la contraseña son erróneas. Intenta nuevamente"
            })
        }
        const isItMatched = await bcryptjs.compareSync(password, foundUser.password)
            if(isItMatched === false){
                return res.render("auth/login", {
                    errorMessage: "El usuario o la contraseña son erróneas. Intenta nuevamente"
                })
            }
        req.session.currentUser  = foundUser
        console.log(req.session.currentUser)

        return res.render("users/profile", {
            foundUser
        })
    } catch (error) {
        console.log(`Hay un error al iniciar sesion : ${error}`)
    }
}


