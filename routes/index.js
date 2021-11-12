const router = require("express").Router();
const User= require('../models/User.model')
/* GET home page */

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res)=>{
  res.render("signup");
})

router.post("/signup", (req, res)=>{
const {email, password} = req.body;
console.log(email, password);
  User.create({email, password})
  .then((createdUser)=>{
  console.log("return from DB after cerating User :",createdUser)
  res.redirect("login");
  })
  .catch((err)=>{
    console.log("Error al crear :",err)

  });
})

router.get("/login", (req, res) => res.render("login"));
router.post("/login", (req, res) =>{
const { email, password } = req.body;
console.log("Going to serach by :",email)
User.findOne({email}).then(
  (user)=>{
  if(!user){

     res.render("error", {error :"not Found"});
  } else
        if(password === user.password){
          console.log("Todo bien")
          req.session.currentUser = user
          res.redirect("private");
         }
      }
).catch(err=> console.log("Erro on login",err));
})

router.use((req, res, next) => {
  console.log(req.session);
  req.session.currentUser ? next() : res.render ("/login", { errorMessage: "Necesitas estar logeado para ver esta página"});
});

router.get("/private", (req, res) => {
  res.render("private", req.session.currentUser);
});

module.exports = router;
