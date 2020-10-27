var express = require("express");
var router = express.Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");



//ITERATION 1 SIGN UP

router.get("/signup", function (req, res, next) {
    res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
    if (req.body.email === "" || req.body.password ==="") {
        res.render("auth/signup", {
            errorMessage: "Username and password required to sign up"
        });
        return;
    }

    const {email, password} = req.body;

    const salt = bcrypt.genSaltSync(8);
    const hashPass = bcrypt.hashSync(password, salt);

    try {
        const user = await User.findOne({ email: email});
        if (user !== null) {
            res.render("signup", {
                errorMessage: "This e-mail is already registered, please enter a valid email.",
            });
            return;
        }
        await User.create({
            email,
            password: hashPass,
        });
        res.redirect("/");
    } catch (error) {
        next(error);        
    }
});

//ITERATION 2 LOG IN

router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });

  router.post("/login", async (req, res, next) => {
    if (req.body.email === "" || req.body.password === "") {
        res.render("auth/login", {
          errorMessage: "Username and password required to log in",
        });
        return;
    }

    const {email, password} = req.body;

    try {
        const user = await User.findOne({ email: email});
        console.log(user);
        if (!user) {
            res.render("auth/login", {
                errorMessage: "The e-mail is not registered",
            });
            return;
        }
        if (bcrypt.compareSync(password, user.password)) {
            req.session.currentuser = user;
            res.redirect("/");
        }else {
            res.render("auth/login", {
                errorMessage: "Incorrect password",
            });
        }
    } catch (error) {
        next(error);
      }
});

// //ITERATION 3 PROTECTED ROUTES
// router.use((req, res, next) => {
//     if (req.session.currentUser) { 
//       next();  
//     } else {                          
//       res.redirect("/login");        
//     }                                
//   });                       
     
//   router.get("/secret", (req, res, next) => {
//     res.render("secret");
//   });


module.exports = router;