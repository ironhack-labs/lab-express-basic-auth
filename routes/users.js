const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

//SIGNUP
router.get("/auth/signup", (req, res, next)=>{
    res.render("signup.hbs");
});

router.post("/auth/signup", (req, res, next)=>{
    const {username, password} = req.body;
    if(!username || !password){
        res.render("signup", {message: "Please fill in the required fields to sign up."});
        return;
    }

    if(password.length < 6){
        res.render("signup", {message: "Password should have at least 6 characters."});
        return;
    };

    User.findOne({username})
    .then((userFromDB)=>{
        if( userFromDB !== null ){
            res.render("signup", { message: "This Username already exists!" });
            return;
        } else {
            const salt = bcryptjs.genSaltSync();
            const hashedPassword = bcryptjs.hashSync(password, salt);

            User.create({username, password: hashedPassword})
            .then(userFromDB =>{
                console.log(userFromDB.password);
                res.redirect("/auth/login");
            })
        }
    })
    .catch(error => next(error));

});

//LOGIN

router.get("/auth/login", (req, res, next)=>{
    res.render("login");
});

router.post("/auth/login", (req, res, next)=>{
    const {username, password} = req.body;

    if(!username || !password){
        res.render("login", {message: "Please fill in the required fields to log in."})
    }

    User.findOne({username})
    .then(userFromDB => {
        if( !userFromDB ) {
            res.render("login", { message: "User doesn't exist." });
            return;
        } else if (bcryptjs.compareSync(password, userFromDB.password)){
            req.session.currentUser = userFromDB;
            res.render("main", {userInSession: req.session.currentUser});
        } else {
            res.render("login", {message: "Your password is incorrect."})
        }
    })
    .catch(error => next(error));

});

router.get("/main", (req, res, next)=>{
    res.render("main", {userInSession: req.session.currentUser});
});

router.get("/private", (req, res, next)=>{
    if( req.session.currentUser ){
        res.render("private", {userInSession: req.session.currentUser});
    } else {
        res.redirect("/");
    }
});

router.get("/logout", (req, res, next)=>{
    req.session.destroy( err=>{
        if (err){next(err)}
        else res.redirect("/");
    }); 
});

module.exports = router;