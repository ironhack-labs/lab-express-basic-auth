const User = require("./../models/User.model")
const bcryptjs = require ("bcryptjs");

exports.viewRegister = (req, res)=>{
  res.render("auth/signup")
}
//VALIDACION REGISTRO
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
              errorMessage: "Hubo un error con tu password. Intenta nuevamente. No dejes espacios y usa minúsculas."
          }) //estatus code 500, se lanza cuando la verificacion en el try falló
    
       }
}

exports.viewLogin = async (req, res) =>{
    res.render("auth/login")
}

//VALIDACION DE LOGIN
exports.login = async (req,res)=>{
    try {
        //1. obtención de datos del formulario
      const username = req.body.username
      const password = req.body.password
        
      //   console.log (email, password)
     
    //2. validación de usuario encontrado en BD
    const foundUser = await User.findOne({ username }) //verificacion por email
    console.log(foundUser)

   if(!foundUser){
       res.render("auth/login",{
           errorMessage: "Usuario o contraseña sin coincidencias"
       })
       return
   }

    //3. Validando contraseña :3
    const verifiedPass = await bcryptjs.compareSync(password, foundUser.passwordEncriptado)
     
    if(!verifiedPass){
        res.render("auth/login",{
           errorMessage: "Usuario o password incorrecto. Intenta nuevamente" 
        })
        return
    }
    console.log("verifiedPass:", verifiedPass)
      
    //4. (prox) Generación de la sesión por medio de cookie
    //PERSISTENCIA DE IDENTIDAD: uso de archivo session.js
   req.session.currentUser = {
       _id: foundUser._id,
       username: foundUser.username,
       mensaje: "USUARIO LOGUEADO ABUEBO"
   }
    //5. Redireccionar al home del perfil del usuario
    res.redirect("/onlyUsers/userProfile")
} catch (error) {
        console.log(error)
}
}

exports.userLogout = async(req, res)=>{
    req.session.destroy(err =>{
        if(err){
            console.log(err)
            return next(err)
        }
        res.redirect("/")
    })
}
