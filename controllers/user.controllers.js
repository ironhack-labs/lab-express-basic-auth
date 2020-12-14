const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const {Error} = require("mongoose"); //Los errores que me da mongoose

const hasCorrectPasswordFormat = password =>{
    //min 6 char + one capital letter + one number + one lower case latter
    const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/);
    return passwordRegex.test(password);
}

const userLogin = async(req,res,next)=>{
    if(req.session.currentUser){
        return next()
    }
    res.redirect("/sign-in")
}

const renderPrivate = async(req,res)=>{
    res.render("private")
}

const renderMain = async(req,res)=>{
    res.render("main")
}

const isMongooseValidationError = (error) => error instanceof Error.ValidationError;//Mongoose le añade errores al JS 

//error = {code: 1100, message:"whatever"}
const isMongoError =({code:errorCode}) => errorCode === 11000;

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
        if(!hasCorrectPasswordFormat(password)){
            return res.send("incorrect password format")
        }
        //const isAlreadyUser = await User.findOne({email})//Para comprobar y no hacer lo demas solo si tengo 1 que comprobar
        const saltRounds = 10;//Complejidad
        const salt = await bcrypt.genSalt(saltRounds)//El string en si
        const hashPassword = await bcrypt.hash(password,salt);//Hashea el passwoprd
        const user = await User.create({email,hashPassword});//{hashPassword, ...user} 
        //console.log("Usuario",user);

        //req.session.currentUser = user._id;//La sessión
        res.redirect("/")
    }catch(err){
        console.error(err);
        if(isMongooseValidationError(err)){
            return res.send("Validation Error" + err.message)
        }
        if(isMongoError(err)){
            return res.send("mongo error" + err.message)
        }
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
        if(!user){
            return res.send("user does not exist");
        }
        const verifyPassword = await bcrypt.compare(password, user.hashPassword);
        if(!verifyPassword){
            return res.send("wrong credentials");
        }
        req.session.currentUser = user._id;//La sessión
        res.render("welcome")
    }catch(err){
        console.error(err);
    }
};

const logout = (req,res) =>{
    req.session.destroy();
    res.render("index")
}



module.exports = {signUp,renderSignUp,renderSignIn,signIn,logout,userLogin,renderPrivate,renderMain}