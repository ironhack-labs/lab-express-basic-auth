require('dotenv').config()
const bcrypt    = require('bcrypt');
const User      = require('../models/User');

exports.singUpView =  (req,res)=>{
const config = {
    action:'Signup',
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
            res.redirect('auth/login')
        }
        // (password !== passVerif)? res.render('auth/signup',config):createUser(name,email,password)
}

exports.loginView = (req,res,next)=>{
const config = {
    action:"Login",
    resgister: false
}
res.render("auth/signup", config)
}


exports.loginPost =async (req,res,next) =>{
    const {email, password} = req.body
    const config= {
        action:"login",
        register:false,
        error: "El usuario o contraseña noes valido"
    }

    const user = await User.findOne({email})
    if(!user){
        res.render("auth/signup")
    }else{
        const confirmed = await bcrypt.compare(password)
        if (confirmed){
            req.session.loggedUser = user
            req.app.locals.loggedUser = user
            res.redirect("/profile")
        }else{
            res.render("auth/signup")
        }
    }
}
exports.profile = (req,res)=> res.render("/profile")
exports.isLogged = (req,res) => {
    (req.session.loggedUser) ? next() : res.redirect('auth/signup')}

