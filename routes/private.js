const express = require("express");
const app = express();



app.get("/private", (req, res, next)=>{
    res.render("private");
})

module.exports = app;