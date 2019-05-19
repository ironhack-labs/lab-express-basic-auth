const express = require("express")
const router = express.Router()

const User = require("../models/User")
const bcrypt = require("bcrypt")
const bcryptSalt = 10

router.get("/signup", (req,res) => {
    res.render("auth/signup")
})

router.post("/signup",(req,res) =>{
    const {username, password} = req.body

    if (!username|| !password){
        res.render("auth/signup",{errMsg: "Rellena los campos"})
        return
    }

    User.findOne({username})
    .then(foundUser =>{
        if (foundUser) {
            res.render("auth/signup", {errMsg: "Sé más original, eso ya existe"})
            return
        }

        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password,salt)
      
        User.create({username, password: hashPass})
        .then(createdUser => {
            console.log(createdUser)
            res.redirect("/")
        })
        .catch(err => console.log("Error", err))
    })
    .catch(err => console.log("Error, Error", err))
}
)

router.get("/login", (req, res) => {
    res.render("auth/login")
})

router.post("/login", (req, res) => {
    const {username, password} = req.body;
    
    User.findOne({username})
    .then(foundUser => {
        if(!foundUser) {
            res.render("auth/login", {errMsg:"Usuario no existe"})
            return
        }
        if(bcrypt.compareSync(password, foundUser.password)){
            req.session.currentUser = foundUser; // guardar en la sesion el usario, con amor Paula :D
            res.render("private/private", {user:req.session.currentUser});
        } else {
            res.render("auth/login", {errMsg:"pass incorrect"})
        }
    })

})

router.use((req, res, next) => {
    if(req.session.currentUser){
        next();
        return;
    }
    res.redirect("/user/login")
    console.log("Entra")
})

router.get("/private", (req, res) => {
    console.log(req.session.currentUser)
    res.render("private/private", {user:req.session.currentUser});
})



module.exports = router