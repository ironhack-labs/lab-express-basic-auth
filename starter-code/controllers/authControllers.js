const bcrypt    = require('bcrypt');
const User      = require('../models/User');

exports.singUpView =async (req,res)=>{

    res.render("auth/signup", )

}




exports.signupPost = (req,res) =>{


    const createUser = async (name,email,password)=>{
        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(password,salt)
        const user = await User.create({name, email, password:hashPassword})
        res.redirect('/')
    }
    
        const {name, email,password, passVerif} = req.body
        const dirAction =
    
            config = {
                signup,
                register:true,
                error: 'Password no conincide'
            }
    
    
        (password !== passVerif)? res.render('auth/signup',config):createUser(name,email,password)


}
