const express = require('express');
const router = express.Router();
const bcrypt       = require("bcrypt")
const session    = require("express-session")
const mongoose     = require('mongoose');
const MongoStore = require("connect-mongo")(session)

const User = require("../models/User.model.js")

//Configuracion de cookies

router.use(session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 
    })
  }));

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


router.get("/sign-up", (req, res, next)=>{
    res.render("signup")
})

router.post("/sign-up",(req, res, next)=>{

    
    const {username, password} = req.body

    User.findOne({username: username})
    .then((result)=>{
        if(!result) {
            bcrypt.genSalt(10)
            .then((salt)=>{
                bcrypt.hash(password, salt)
                .then((hashedPassword)=>{
        
                    let hashedUser = {username: username, password: ""}
                    hashedUser.password = hashedPassword
        
                    User.create(hashedUser)
                    .then((result)=>{
                        res.redirect("/")
                    })
                })
            })
            .catch((err)=>{
                console.log(err)
                res.render(err)
            })
        } else {
            res.render("login", {errorMessage: "Este usuario ya existe. ¿Querías hacer Log In?"})
        }
    })
})

router.get("/log-in", (req, res, next)=>{
    res.render("login")
})

router.post("/log-in", (req, res, next)=>{
    //console.log(req.body)
    const {username, password} = req.body

    User.findOne({username: username})
    .then((result)=>{
        if(!result) {
            console.log("El usuario no existe")
            res.render("login", {errorMessage: "Este usuario no existe."} )
        } else {
            //Comparar la contraseña para ver si es correcta con BCRYPT
            bcrypt.compare(password, result.password)
            .then((resultFromBcrypt)=>{
                if(resultFromBcrypt) {
                    req.session.currentUser = username
                    console.log(req.session)
                    res.redirect("/")
                    //req.session.destroy(logout)
                } else {
                    res.render("login", {errorMessage: "Contraseña incorrecta. Por favor vuelva a intentarlo"})
                }
            })
        }
    })
})

router.get("/log-out", (req, res, next)=>{
    req.session.destroy()
    res.redirect("/")
})


//MIDDLEWARE PARA.... SESION LOG IN

router.use((req,res,next)=>{
    if(req.session.currentUser) {
        next();
    } else {
        res.redirect('/log-in')
    }
})

router.get("/main", (req, res, next)=>{
    res.render("main")
})

router.get("/private", (req, res, next)=>{
    res.render("private")
})


module.exports = router;