const router = require("express").Router();

const UserModel = require("../models/User.model")

const bcrypt = require("bcryptjs")


router.get("/signup", (req, res, next)=>{
    res.render("auth/signup")
})

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body

    if(!username || !password) {
        res.render('auth/signup.hbs', {error: "You must enter all fields"})
        return;
    }
    UserModel.exists({username: username})
        .then((exists)=>{
            if(exists) {
                res.render('auth/signup.hbs', {error: "This username is not available"})
                return;
            }
            else {
                const salt = bcrypt.genSaltSync(10);
    
                const hash = bcrypt.hashSync(password, salt);
            
                UserModel.create({username, password: hash})
                    .then(()=>{
                        res.redirect("/main")
                    })
                    .catch((err)=>{
                        next(err)
                    })
            }
        })    
        .catch((error)=>{
            next(error)
        })
})


router.get('/signin', (req, res, next) => {
    res.render("auth/signin.hbs")
})

router.post('/signin', (req, res, next) => {
    const {username, password} = req.body
    
    if(!username || !password) {
        res.render('auth/signin.hbs', {error: "You must enter all fields"})
        return;
    }
    
    UserModel.findOne({username})
        .then((user) => {
            if (user) {
                let isValid = bcrypt.compareSync(password, user.password)
                if (isValid) {
                    req.session.loggedInUser = user
                    req.app.locals.isLoggedIn = true;
                    res.redirect("/private")
                }
            }
            else {
                res.render('auth/signin.hbs', {error: "User not found"})
            }
        })
})

router.get("/logout", (req, res, next)=>{
    req.session.destroy()
    req.app.locals.isLoggedIn = false
    res.redirect("/main")
})


function checkLoggedIn(req, res, next){
    if ( req.session.loggedInUser) {
        next()
    }
    else{
      res.redirect('/signin')
    }
  }

router.get("/private", checkLoggedIn, (req, res, next)=>{
    res.render("auth/private.hbs")
})

router.get("/main", (req, res, next)=>{
    res.render("auth/main.hbs")
})


module.exports = router;