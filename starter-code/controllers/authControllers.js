require('dotenv').config()
const bcrypt    = require('bcrypt');
const User      = require('../models/User');

exports.singUpView =  (req,res)=>{
const config = {
    action:'Signup',
    register:true

    }
    res.render("auth/signup", config)
    console.log(bcrypt);



}




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
            console.log(user)
            res.redirect('/')
        }

        // (password !== passVerif)? res.render('auth/signup',config):createUser(name,email,password)


}
