const express = require("express")
const app = express()

app.get("/",(req,res)=>{
    res.render("main")
})

module.exports = app ;