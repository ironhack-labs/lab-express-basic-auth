//controllers

const res = require("express/lib/response")

exports.getHome = (req,res) => {

    res.render("index")
}

exports.getProfile =(req,res) => {


    res.render("profile")
}
