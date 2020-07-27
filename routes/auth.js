//ponemos rutas para express
const express = require("express");
const router = express.Router();

//traemos el modelo USER
const User = require("../models/User.model");

//Traemos Bcrypt para encriptar las passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

//Agregamos ruta para renderizar signup.hbs view
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

//Creamos el post para el signup junto con alguna valoraciones.
router.post("/signup", (req, res, next) => {
    //obtenemos los datos del body
    const { username, password } = req.body;
    //miramos si los campos estan vacios
    //si estan vacios devolvemos un error
    if (username === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "Indicate a username and a password to sign up",
        });
        return;  
    }

    //busco en la DB si existe el username
    User.findOne({ username })
        .then((user) => {
            //si user es diferente a null, quiere decir que ya existe por lo tanto devuelve error.
            if (user !== null) {
                res.render("auth/signup", {
                    errorMessage: "The username already exists",
                });
                return;
            }
            //en el caso de que no exista pasamos a la parte del password
            //para ello creamos los metodos para encriptar las contraseñas
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            //Una vez creadas las variable empezamos a crea un nuevo User en nuestra DB
            User.create({ username, password: hashPass })
                //Y lo redirigimos al inicio
                .then(() => {
                    res.redirect("/");
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            next(error);
        });
});

//Agregamos metodo get para renderizar login:
router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

//Ahora el metodo post en el que utilizaremos la misma validación en el caso que este vacio el campo
//Luego le decimos que compruebe si existe el username
//comprueba que la contraseña que entra es la misma que tenemos en nuestra DB
//Si esta todo correcto crea un currentUser y envialo al inicio.
router.post("/login", (req, res, next) => {
    //traemos los datos del body
    const { username, password } = req.body;
    //comprobamos que los campos no estan vacios.
    if (username === "" || password === "") {
        res.render("auth/login", {
            errorMessage: "Please enter both, username and password to login",
        });
        return;
    }

    //Buscamos en la DB si existe el username
    User.findOne({ username })
    .then((user) => {
        if(!user) {
            res.render("auth/login", {
                errorMessage: "The username doesn't exist"    
            });
            return;
        }

        //si existe comprbamos que la contraseña sea igual a la de nuestra BD
        if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect('/')
        } else {
            res.render("auth/login", {
                errorMessage: "Incorrect password"
            })
        } 
    })
    .catch((error) => {
        next(error);
    })
});

//Agrgamos module.exports=router que es el encargado de mapear los objetos recibidos de /user 
//si lo quitamos requitre statement no podrá recibir el objeto.
//siempre se pone al final del archivo
module.exports =  router;