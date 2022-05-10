const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User.model')
const isLoggedIn = require('../middleware/isLoggedIn')
const isLoggedOut = require('../middleware/isLoggedOut')


router.get("/auth/signup", isLoggedOut,(req,res,next)=>{
    res.render("auth/signup")
})

router.post("/auth/signup",isLoggedOut,(req,res,next)=>{
    const {password,username}=req.body //esos nombres vienen de lo que manda signup.hbs
    if(!username||!password){
        res.render("auth/signup", {errorMessage:"You must fill all the fields!"})
        return
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
            .status(500)
            .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }

    const saltRounds=12
const salt = bcrypt.genSaltSync(saltRounds)
const newPassword = bcrypt.hashSync(password,salt);
req.body.password=newPassword
//console.log(req.body)
User.create(req.body)
    .then(()=>{
        res.redirect("/userWelcome")
    })
    .catch(err=>{console.log("Error en crate: ", err)})
})

router.get("/auth/login",isLoggedOut, (req, res) => {
    res.render("auth/login")
})

router.post("/auth/login", isLoggedOut,(req,res)=>{
    const {username,password}=req.body
    //console.log(username,password)
    User.findOne({username})
    .then(findedUser=>{
        //console.log(findedUser)
        req.session.currentUser=findedUser
        if(!findedUser){
            res.render("auth/login", { errorMessage: "This username does not exist" })
                return
        } else if(bcrypt.compareSync(password,findedUser.password)){
            res.render('users/user-profile', { currentUser:findedUser })
        }else{
            res.render("auth/login",{errorMessage:'Incorrect Password.'})
        }

    })
    .catch(console.log)
})

router.post("/auth/logout", isLoggedIn, (req,res)=>{
    req.session.destroy(err => {
        if (err) {
            console.log("entre al error")
            next(err)
        }
        res.redirect('/');
    });
})


module.exports=router;