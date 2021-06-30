const express = require("express");
const authRouter = express.Router();
const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const saltRounds = 8;

const zxcvbn = require("zxcvbn");


authRouter.get("/signup", (req, res) => {
    res.render("auth-views/signup-form")
});
  
// POST    '/auth/signup'
authRouter.post("/signup", (req, res, next) => {
   
    const { username, password } = req.body;

    if (username === "" || password === "") {
        res.render("auth-views/signup-form", {
        errorMessage: "Username and Password are required.",
        });
        return;
    }

    const passwordStrength = zxcvbn(password).score;

    // console.log("zxcvbn(password) :>> ", zxcvbn(password));
    // console.log("passwordStrenth :>> ", passwordStrength);
    if (passwordStrength < 3) {
        res.render("auth-views/signup-form", {
        errorMessage: "Password is too weak",
        });
        return;
    }

    User.findOne({ username })
        .then((userObj) => {
            
        if (userObj) {
            res.render("auth-views/signup-form", {
            errorMessage: `Username ${username} is already taken.`,
            });
            return;
        } else {
           
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            User.create({ username, password: hashedPassword })
            .then((user) => {
                console.log("Congratulations! You have successfully registered!")
                res.redirect("/");
            })
            .catch((err) => {
                res.render("auth-views/signup-form", {
                errorMessage: `Error during signup`,
                });
            });
        }
        })
        .catch((err) => next(err));
});

authRouter.get("/login", (req, res) => {
    res.render("auth-views/login-form")
})

authRouter.post("/login", (req, res)=>{
    const {username, password} = req.body
  
    if (username === "" || password === "") {
      res.render("auth-views/login-form", { errorMessage: "Username and Password are required." });
      return;
    }
  
    User.findOne({username})
    .then(user=>{
           if (!user) {
            res.render("auth-views/login-form", { errorMessage: "Input invalid" });
          } 
            else {
                const encryptedPassword = user.password;
                const passwordCorrect = bcrypt.compareSync(password, encryptedPassword);
         
                if(passwordCorrect){
                    console.log("You are logged in!")
                    req.session.currentUser = user;
                    console.log(user)
                    res.redirect("/")
                } else {
                    res.render("auth-views/login-form", { errorMessage: "Name OR pwd is incorrect" });
                }
            }
    })
  
})

authRouter.get('/logout', (req, res)=>{
    req.session.destroy(err =>{
      if(err){
        res.render("error", { message: "Something went wrong! Yikes!" });
      }else{
        console.log("You have successfully logged out!")
        res.redirect('/')
      }
    })
  })

module.exports = authRouter;