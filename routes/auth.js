const express = require ('express');
const router = express.Router();

// User model

const User = require("../models/User.model");

// Bcrypt to encrypt passwords

const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

// Agregamos una ruta de signup, que renderiza la vista auth/signup.hbs

router.get("/signup", (req,res,next) => {
    res.render("auth/signup");
});

//recibe los datos del formulario de signup, toma los valores del form req.body y los asigna a constantes
// genera el salt y hace hash del password con el salt
// crea el objeto User y redirecciona

router.post("/signup", (req,res,next) => {
    const {username, password} = req.body; 

    //validamos si los valores de los inputs llegan vacíos

    if (username === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "Indicate a username and a password to sign up",

        });
        return

    }

    //busco en la BD si existe el username

    User.findOne({username})
    .then((user) => {
        if(user !== null) {
            res.render("auth/signup", {
                errorMessage: "The username already exists",

            });
                return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        User.create({username, password: hashPass})
        .then(() => {
                res.redirect("/");
        })
        .catch((error) => {
            console.log(error);
        })

        .catch((error) =>{
            next(error);

        });

    });

});

    //renderizar el formulario del login

    router.get("/login", (req,res,next) => {
        res.render("auth/login");
    });
    
    

    router.post("/login", (req,res, next) => {
        //asignamos a variables los datos que vienen del form
        const {username, password} = req.body;
        //verificamos que los valores del form no lleguen vacios
        if (username === ""|| password === ""){
            res.render("auth/login", {
                errorMessage:"Please enter both, username and password to login",
            });
            return;
        }

    //Buscamos en la BD si existe un username con los datos del user que viene del form
    //si no lo encuentra, nos dice que el user no existe
    //sino, nos devuelve el user
    //usamos el método compareSync para hacer el hash del form input y compararlo con el password guardado en la BD
       
        User.findOne({username})
        .then((user) => {
            if (!user) {
                res.render("auth/login", {
                    errorMessage: "The username doesn´t exist"
                });
                return;

            }

        
            if(bcrypt.compareSync(password, user.password)){
                //Save the login in the session
                // the request object has a property called session were we can add the values we want to store on it. In this case, we are setting it up
                req.session.currentUser = user;
                res.redirect('/private')
            }else {
                res.render("auth/login",{
                    errorMessage:"Incorrect password"


                })
            }

        })

        .catch((error) =>{
            next(error);
        })

  });

    module.exports = router;