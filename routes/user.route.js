const router = require("express").Router();
const bcryptjs = require('bcryptjs')
const UserModel = require("../models/User.model")
const roundSalt = 10;


router.get("/signup", (req,res, next) => {
    res.render("user/signup")
})

router.post('/signup', (req,res,next)=> {
    const {username, password} = req.body;

    if(!username || !password ){
        res.render('user/signup', {errorMessage: "Enter Information"})
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(400).render('user/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }
    
    bcryptjs
        .genSalt(roundSalt)
            .then((salt) => {
                return bcryptjs.hash(password, salt)
            })
            .then((hashPassword) => {
                const newUserHash = {
                    username: req.body.username,
                    password: hashPassword
                }
                return UserModel.create(newUserHash)
            })
            .then(() =>{
                res.redirect("/login")
            })
            .catch((error) => {
                console.log("error wit creation of User", error);
                next(error);
            })
})


router.get("/login", (req,res, next) => {
     res.render("user/login")
})

router.post("/login", (req,res,next) => {
    const {username, password} = req.body

    if(username === '' || password === '') {
        res.status(400).render("auth/login", {errorMessage: "please enter Password and E-mail"})
        return;
    }

    UserModel.findOne({username: username})
    .then((user) => {
        if(!user){
        res.status(400).render('user.login', {errorMessage: "Nous n'avons pas de compte avec ce Username"})
        return
        } else if(bcryptjs.compareSync(password, user.password)){
            console.log(user);
            req.session.currentUser = user
            res.render("user/profile", {userDetails: user})
        } else {
            res.status(400).render('user/login', {errorMessage: "Doesn't exist"});
        }
    })
    .catch( (error) => {
            console.log('Error with Login', error)
            next(error);
        })
})

router.get("/profile", (req,res, next) => {
    res.render('user/profile', {userDetails: req.session.currentUser})
})

module.exports = router;
