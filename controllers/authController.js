const User = require("./../models/User.model")
const bcryptjs = require ("bcryptjs");

exports.viewRegister = (req, res)=>{
  res.render("auth/signup")
}

exports.register = async(req, res)=>{
    const username = req.body.username
    const password = req.body.password

    //validation1
    if(!username || !password){
        res.render("auth/signup", {
            errorMessage: "Uno o mas campos están vacios. Revísalos nuevamente"
        })
        return
    }

    //validation2
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
    if(!regex.test(password)){
        res.render("auth/signup",{
         errorMessage: "Tu password debe de contener 6 caracteres, mínimo un numero y una mayúscula"
        })
        return
    }

    try {
        const salt = await bcryptjs.genSalt(10)
        const passwordEncriptado = await bcryptjs.hash(password, salt)
        
        const newUser = await User.create({
            username,
            passwordEncriptado
        })
        
        res.redirect("/") //redireccionamos al inicio
           
       } catch (error) {
          console.log(error)
          res.status(500).render("auth/signup",{
              errorMessage: "Hubo un error con la validez de tu correo. Intenta nuevamente. No dejes espacios y usa minúsculas."
          }) //estatus code 500, se lanza cuando la verificacion en el try falló
    
       }
}

