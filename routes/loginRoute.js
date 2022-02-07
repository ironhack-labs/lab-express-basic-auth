const router = require("express").Router();
const bcryptjs=require('bcryptjs')

//aparece User
const User =require('./../models/User.model')
const saltRounds= 10 

//sale el Sign Up 

router.get("/signup",(req,res,next)=>{
    res.render("signup");//esto es archivo de views/signup
});
//usamos el Sign Up

router.post("/signup",(req,res,next)=>{

    const{username,password}=req.body
    bcryptjs
    .genSalt(saltRounds)
    .then(salt=>bcryptjs.hash(password,salt))
    .then(hashedPassword=>{
    return User.create({ username,password:hashedPassword})
})
    .then(createUser=> res.redirect('/'))
    .catch(error=>next(error))
})

// sale el Log In
router.get("/login", (req, res, next) => {
    res.render("login");// esto es archivo de views/ login
});
// Usamos el Log In
router.post("/login",(req,res,next)=>{
    const{username,password}=req.body
    User
    .findOne({username})
    .then(user=>{
        if (!user){
            res.render('login',{errorMessageUser:'uuuuy ese mail no nos suena, try again'})
            return 
        }
        else if (bcryptjs.compareSync(password,user.password)===false){
         res.render('login',{errorMessagePassword:'Metiste la pata, fiajte e inténtalo otra vez'})
         return   
        }///hasta aqui si no estás logineado o metes a pata
        else{
            req.session.currentUSer=user
            res.redirect('/perfil')
        }
    })
})
// Cerramos el Login 
router.post('/logout',(req,res)=>{
    req.session.destroy(()=> res.redirect('login'))
})

module.exports = router;