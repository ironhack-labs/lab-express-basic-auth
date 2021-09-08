
const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcryptjs");
const mongoose= require("mongoose")
const { findOne } = require("../models/User.model");
const saltRounds = 10
/* GET home page */
router.get("/singup", (req, res, next) => {
  res.render("user/singUp");
});

router.post( "/singup", (req,res) =>{

    const {username, password} = req.body

    


    if(!username || !password){
        res.render('user/singUp', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
        return;
    }


bcrypt
.genSalt(saltRounds)
.then(salt =>bcrypt.hash(password, salt))
.then(hashedPassword =>{
    return User.create({username: username, password: hashedPassword})}
    )

.then(createdUser => console.log(createdUser),
res.redirect("/"))


.catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('user/singUp', { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render('user/singUp', {
         errorMessage: 'Username and email need to be unique. Either username or email is already used.'
      });
    } else {
      next(error);
    }
  })
})


/*LOGIN ROUTES*////////////////////
router.get("/login", (req, res, next) => {
    res.render("user/login");
  });


router.post("/login", (req,res) =>{

    const {username , password} = req.body

    console.log('SESSION =====> ', req.session);
    /*VALIDATION*/

    if(username === "" || password === ""){
        res.render("user/login" , {errorMessage: "you must provide both username and password"})
        return;
    }
    
    User
    .findOne({username})
    .then(user =>{
        if(!user){
            res.render("user/login",{errorMessage: "User not registered"})
            return;
        }else if(bcrypt.compareSync(password, user.password)){
            req.session.currentUser = user
            res.render("user/userProfile", user)
        }else{res.render("user/login", {errorMessage: "incorrect Password"})}
    })

    .catch(err =>console.log(err))







})


module.exports = router;