require('dotenv').config()
const bcrypt    = require('bcrypt');
const User      = require('../models/User');

exports.singUpView =  (req,res)=>{
const config = {
    action:'signup',
    register:true

    }
    res.render("auth/signup", config)
}
// const createUser = async (name,email,password)=>{
// const salt         = await bcrypt.genSaltSync(Number(process.env.SALT))
// const hashPassword = await bcrypt.hashSync(password, salt)
// const user         = await User.create( {name, email, password: hashPassword} )
// console.log(user)
// res.redirect('/')
//}
exports.signupPost =async (req,res) =>{
        const {name, email,password, passVerif} = req.body
        const config = {
                action:'signup',
                register:true,
            }
        if(password !== passVerif ){
            res.render('auth/signup',config)
        }else{
            const salt         = await bcrypt.genSaltSync(Number(process.env.SALT))
            const hashPassword = await bcrypt.hashSync(password, salt)
            const user         = await User.create( {name, email, password: hashPassword} )
            res.redirect('/profiles/profileUser')
        }
        // (password !== passVerif)? res.render('auth/signup',config):createUser(name,email,password)
}

exports.loginView = (req,res,next)=>{
const config = {
    action:"login",
    resgister: false
}
res.render("auth/signup", config)
}


exports.loginPost =async (req,res,next) =>{
    const {email, password} = req.body
    const config= {
        action:"login",
        register:true,
        error: "El usuario o contraseña no es valido",
        suggest:'Registrate'
    }

    const user = await User.findOne({email})
    if(!user){
        config.action = 'signup'
        config.register = true
         res.render('auth/signup', config)
    }else{
        const confirmed = await bcrypt.compareSync(password,user.password)
        if (confirmed){

            console.log(req);
            // req.session.loggedUser = user
            // req.app.locals.loggedUser = user
            res.redirect("/profiles/profileUser")
        }else{
            config.action = 'login'
            config.register = false
             res.render('auth/signup', config)
        }
    }
}
exports.profileView = (req,res)=> res.render("profiles/profileUser")
