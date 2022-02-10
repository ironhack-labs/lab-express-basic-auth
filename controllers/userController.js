//Controler
const express = require("express")
const res = require("express/lib/response")
const bcryptjs = require("bcryptjs")
const User = require("./../model/User")


//A. REGISTRO 

exports.register= (req,res) => {

    res.render("register")
}


exports.registerForm = async (req,res) => {

    const {username , password} = req.body

    //mezcla de contrasena
    const salt = await bcryptjs.genSalt(10)

    //encriptacion

    const hashedPassword = await bcryptjs.hash(password, salt)
    //console.log(hashedPassword)

    
    const newUser = await User.create({
        username,
        password: hashedPassword
    })

    res.redirect("/profile")

}

exports.profile = (req,res) => {

        res.render("profile")
}




//B. Login
exports.login = (req,res) => {

    res.render("login")

}