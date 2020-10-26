var express = require("express");
var router = express.Router();

const User = require("../models/User.model");

const bcrypt=require('bcryptjs');

router.get('/signup', (req, res, next)=>{
    res.render('auth/signup');
})

router.post('/signup', async(req,res,next)=>{
    if (req.body.username ===""||req.body.password===""){
        res.render('auth/signup',{
            errorMessage:"Username and password are required"
        });
        return;
    }
    // molaría añadir aquí verificación de al menos 6 caracteres en la password
    // si tienes ganas pnlo luego ;)

    const {username, password }=req.body;

    const salt=bcrypt.genSaltSync(10);
    const hassPass=bcrypt.hashSync(password, salt);

    try {
        const user= await User.findOne({username});
        if(user){
            res.render('auth/signup', {
                errorMessage: "This username is already in use"
            });
            return;
        }

        await User.create({
            username,
            password:hassPass,
        });
        res.redirect("/");
    } catch (error) {
        next(error); 
    }
});

router.get('/login', (req, res, next)=>{
    res.render('auth/login');
});

router.post('/login', async (req, res, next)=>{
    
    if(req.body.username===""||req.body.password===""){
        res.render('auth/login',{
            errorMessage:"Introduce your username and password to Login"
        });
        return;
    }

      const {username, password}=req.body;

    try {

        const user= await User.findOne({username:username});

       
        if(!user){
            res.render('auth/login', {
                errorMessage:"This username doesn't exist"
            });
            return;       
        }
        
        
        if(bcrypt.compareSync(password, user.password)){
            
            req.session.currentUser=user;
            
            res.redirect("/");
        }else{
            res.render('auth/login', {
                errorMessage:"Incorrect password"
            });
        }
    } catch (error) {
        
        // porqué se utiliza en este caso un bloque trycatch????

    }  
});


router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
      res.redirect('/login');
    });
});

module.exports = router;