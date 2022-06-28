const router = require("express").Router();
const User = require("../models/User.model");
const {checkRole} = require("../middleware/customMiddleware")
const isLoggedIn = require("../middleware/isLoggedIn")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//rutas para el admin

router.get('/admin/users',isLoggedIn,checkRole(["ADMIN"]), (req, res, next) => {

console.log("está logeado?", isLoggedIn)

User.find({role:{$ne:"ADMIN"}},{password:0}) //esto último el password es una proyección. osea, no va a enviar el password al user. lo filtra
//esto del password :0 es un filtro
.then(users =>{
console.log("users",users)
  res.render("listUser",{users});
})
.catch((err) => {
  next(err);
})


  


})


module.exports = router;