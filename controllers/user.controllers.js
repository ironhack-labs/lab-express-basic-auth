const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

const renderSignUp = async (req,res)=>{
    res.render("sign-up")
}

const signUp = async (req,res) =>{
    try{
        const {email,password} = req.body;
        console.log(password);
        const hasMissingCredential = !email || !password
        if(hasMissingCredential){
            return res.send("credentials missing");
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds)
        const hashPassword = await bcrypt.hash(password,salt);
        console.log("hasPassword",hashPassword);
        const user = await User.create({email,hashPassword});
        console.log("Usuario",user);
        res.redirect("/")
    }catch(err){
        console.error(err);
    }
}

const renderSignIn = async (req,res)=>{
    res.render("sign-in")
}

const signIn = async (req,res) => {
    try{
        const {email,password} = req.body;
        console.log(password);
        const hasMissingCredential = !email || !password
        if(hasMissingCredential){
            return res.send("credentials missing");
        }
        const user = await User.findOne({email});
        if(!email){
            return res.send("user does not exist");
        }
        const verifyPassword = await bcrypt.compare(password,user.hashPassword);
        if(!verifyPassword){
            return res.send("wrong credentials");
        }
        res.render("welcome")
    }catch(err){
        console.error(err);
    }
}



module.exports = {signUp,renderSignUp,renderSignIn,signIn}