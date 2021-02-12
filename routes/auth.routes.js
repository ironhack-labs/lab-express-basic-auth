//1. IMPORTACIONES

const express = require("express")
const router = express.Router()
const bcryptjs = require("bcryptjs")
const saltRounds = 10
const UserSchema = require('../models/User.model')
const UserModel = require("../models/User.model")
const mongoose = require('mongoose');


//GET, mostrar el formulario de registro

router.get("/signup",(req,res,next)=>{
    res.render("auth/signup")
})


//POST, para procesar la info del registro

router.post("/signup",(req,res,next)=>{
    //console.log('The form data:',req.body)
     const {username, email, password} = req.body

   
     if (!username || !email || !password) {
        res.render('auth/signup', { errorMessage: 'Los tres campos son obligatorios, por favor llénalos' });
        return;}

        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!regex.test(password)) {
          res
            .status(500)
            .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
          return;
        }

     bcryptjs.genSalt(saltRounds)
     .then((salt)=>{
         bcryptjs.hash(password,salt)
    .then((hashedPassword)=>{
        
        //console.log(`Password hash:${hashedPassword}`)
        return UserSchema.create({username, email,passwordHash:hashedPassword})
    })
    .then((userFromDB)=>{
        console.log('Newly created user is: ', userFromDB)
        res.redirect('/userProfile');

    })
    .catch((error) => {
        // copy the following if-else statement
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: error.message });

        } else if (error.code === 11000) {
            res.status(500).render('auth/signup', {
               errorMessage: 'Username and email need to be unique. Either username or email is already used.'
            });
        
           
          } else {
            next(error);
          }
        }); 

     })

})

// LOGIN

//Ruta GET para mostrar a los usuarios el formulario de entrada

router.get('/login',(req,res)=>{
    res.render('auth/login')
})

// Ruta POST para el login ==> procesar la info

router.post('/login',(req,res,next)=>{
    console.log('SESSION =====>', req.session);
    const {email, password} = req.body
    
    if (email === "" || password === "" ) {
        res.render('auth/login', {
            errorMessage: "Please enter both, email and password to login"
        });
        return;
    }

    UserModel.findOne({email})
    .then(userFound => {
        if (!userFound) {
            res.render('auth/login',{errorMessage:"El correo no está registrado.  Intenta con otro correo"});
            return;
        
        } else if (bcryptjs.compareSync(password,userFound.passwordHash))
        {
            //res.render('users/userProfile',{user});
            req.session.currentUser = userFound;
          
            let sesionConUsuario = req.session

            console.log("sesionConUsuario", sesionConUsuario)

            res.redirect('/userProfile');

        } else {
            res.render('auth/login',{errorMessage: 'Incorrect password.'});
        }
    })
    .catch(error => next(error))
})

// GET, mostrar la página privada al usuario registrado
//router.get('/userProfile', (req, res) => res.render('users/userProfile'));

router.get('/userProfile', (req, res) => {
    let cuqui = req.session
    console.log("esto es el req.session",cuqui)
    res.render('users/user-profile', {
      galleta: req.session
    })
  });



module.exports = router;