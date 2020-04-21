const express= require("express"); 
const router= new express.Router();
const User = require("../models/user");

const bcrypt = require("bcrypt"); 

//SIGN IN

router.get("/signin", (req, res)=>{
  res.render("auth/signin.hbs", {error: req.flash("error")})
});

router.post("/signin", (req, res)=>{
  const {username, password} =req.body; 

  User
  .findOne({username: username})
  .then((foundedUser)=>{
    if(!foundedUser){
      req.flash("error", "Invalid credentials...");
      res.redirect("/auth/signin")
    }else{
        if(bcrypt.compareSync(password, foundedUser.password)){
          req.session.currentUser = foundedUser;
          res.redirect("/private");
        } else {
          req.flash("error", "Invalid credentials");
          res.redirect("/auth/signin")
        }
    }
  })
  .catch((dbErr)=>{console.log(dbErr)})
});



// SIGN UP
router.get("/signup", (req, res, next)=>{
  res.render("auth/signup.hbs", {error : req.flash("error")})
})


router.post("/signup", (req, res, next)=>{
  const {username, password} = req.body;
  User
  .findOne({username: username})
  .then((foundUser)=>{
    if(foundUser){
      req.flash("error", "The username is already taken, sorry");
      res.redirect("/auth/signup")
    }else{
      const salt = 10; 
      const hashedPassword = bcrypt.hashSync(password, salt); 
      const newUser={
        username, 
        password: hashedPassword
      }; 

    User.create(newUser)
			.then((createdUser) => {
				res.redirect('/auth/signin');
			})
			.catch((dbErr) => {
				console.log(dbErr);
      })
      
	.catch((dbErr) => {
			console.log(dbErr);
			});

    }
  }) 
});



module.exports= router; 