//requerimos mongoose

const express = require("express");
const router = express.Router();

//requerimos el modelo que vamos a usar, el user de aqui es el nmbre de mi archivo
const UserModel = require("../models/User");

//requerimos bcrypt
const bcrypt = require("bcrypt");
//decimos cuantas veces queremos que se ejecute salt
const bcryptSalt = 10;

//declaramos la ruta de signup y que renderice la vista dentro de mi carpeta auth archivo signup
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
  });

router.post("/signup", (req, res, next)=> {
    //desestructurar el req.body todos los datos en los campos
    const {username, password}=req.body

    if (username === "" || password === "") {
        res.render("auth/signup", {
          errorMessage: "Indicate a username and a password to sign up",
        });
        return;
      }
    

    //a partir del username que me busque la informacion en mi coleccion
    UserModel.findOne({ username })
      .then((user) => {
        if (user !== null) {
          //primer parametro donde quiero mostrarlo, segundo que datos quiero inyectar
          res.render("auth/signup", {
            errorMessage: "The username already exists",
          });
          return;
      }
       //este metodo es de bcrypt, genera un string random que se añade a mis datos antes de encriptarlos
      const salt = bcrypt.genSaltSync(bcryptSalt);
      //hash el metodo que toma mi contraseña y el aleatorio de arriba y me devuelve mi contraseña encriptada
      const hashPass = bcrypt.hashSync(password, salt);

      //creo un nuevo objeto/documento apartir de mi restriccion modelo osea siguiendo el esquema. UserModel es el nombre de mi controlador q sigue mi esquema
      //devuelve mi objeto creado osea mi usuario
      UserModel.create({ username, password: hashPass })
        .then((usuario) => {
            //despues de haber creado mi usuario y contraseña me redireccione al home
          res.redirect("/");
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
        //si le paso parentesis vacios va al siguiente mildware si le paso algun argumento va al app.js donde tengo declarado los errores
      next(error);
    });
})



//metodo post

router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });
  
  router.post("/login", (req, res, next) => {
    //asignamos a variables los datos que vienen del form
    const { username, password } = req.body;
  //verificamos que los valores del form no lleguen vacíos
    if (username === "" || password === "") {
      res.render("auth/login", {
        errorMessage: "Please enter both, username and password to login",
      });
      return;
    }
  
    
    UserModel.findOne({ username })
    .then((user) => {
        if(!user) {
            res.render("auth/login", {
                errorMessage: "The username doesn't exist"
            });
            return;
        }

        //compara el password que viene del formulario del login con el que viene encriptado de base de datos
        const passwordCorrect=bcrypt.compareSync(password, user.password)
        
            if (passwordCorrect){
          //me crea una sesion valida con los datos del usuario, activa la creacion de la sesion y de las cookies, 
          //tengo que declarar la constante de sesion en app.js, app.use y todo lo demas
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
  
  


  module.exports = router;