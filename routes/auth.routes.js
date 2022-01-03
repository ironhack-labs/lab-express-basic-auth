const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const {isLogged, isLoggedOut} = require("../middleware/route-guard")
const mongoose = require('mongoose');



//signup
router.get("/signup", (req, res, next) => res.render("auth/signup"));
router.post("/signup", async (req,res,next)=>{
    const { name, password, email} = req.body;

    if(!name || !password || !email){
        res.render("auth/signup", {
            errorMessage:
            "Please fill in all the empty fields"
        })
        return;
    }

User.findOne({email})
.then(user => {
    if(user){
        res.status(500).render("auth/signup",{
            errorMessage:
            "This email has already been registered"
        })
        return
    }else{
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!regex.test(password)) {
            res.status(500).render("auth/signup", {
                errorMessage:
                    "Password must be at least 6 characters long and contain at least one number, and uppercase letter."
            });
            return;
        }
        bcryptjs
        .genSalt(saltRounds)
        .then((salt) => bcryptjs.hash(password,salt))
        .then((hashedPassord) =>{
            let usernameCreate = email.replace(".com","").replace("a","");
            return User.create({
                name, email, username: usernameCreate, password: hashedPassord,
            });
        })
        .then((userFromDB) => res.redirect("/userProfile"))
        .catch((err) =>{
            if (err instanceof mongoose.Error.ValidationError){
                res.status(500)
                res.render("auth/signup",{
                    errorMessage: "This email has already been taken"
                })
                return
            }else{
                next(err)
            }
        })
    }
})

});

router.get("/login", (req,res,next) => {
    const {email, password} =req.body

    if(email === "" || password === ""){
        res.render("auth/login", {
            errorMessage:
            "You need email and password to login"
        })
        return
    }
    User.findOne({email})
    .then(user => {
        if(!user){
            res.render("auth/login", {
                errorMessage: "Email not registered"
            })
            return
        }else if(bcryptjs.compareSync(password, user.paswordHash)){
            req.session.currentUser = user
            res.redirect("/userProfile")
        }else{
            res.render("auth/login",{
                errorMessage: "Wrong password"
            })
            return
        }
    })
    .catch(err =>
        next(err))
})

router.post("/logout", (req,res,next) => {
    req.session.destroy(err => {
        if(err) next(err)
        res.redirect("/")
    })
})



router.get("/main", isLogged, (req,res,next) =>{
    res.render("users/user-main", {userIn: req.session.currentUser})
})

router.get("/private", isLogged, (req,res,next) => {
    res.render("users/user-private", {userIn: req.session.currentUser})
})

module.exports = router;
