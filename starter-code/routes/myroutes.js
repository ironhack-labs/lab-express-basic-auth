const express = require('express');
const myroutes = express.Router();

myroutes.get('/', (req,res,next)=>{
  res.render('index');
});

myroutes.get("/signup", (req,res,next)=>{
  res.render("signup")
})

myroutes.post("/signup", (req,res,next)=>{
  res.render("index")
})


module.exports = myroutes;
