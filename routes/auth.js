const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")

router.get("/signup", (req,res,next) =>{
    res.render("auth/signup")
})

router.post("/signup", (req,res,next) => {
    const {username,password} = req.body
    if (username === "") {
        res.render("auth/signup", {message: "Username cannot be empty"})
        return
    }

    if (password.length < 4) {
        res.render("auth/signup", {message: "Password has be minium 4 characters"})
        return
    } 
    User.findOne({ username })
        .then(userFromDB => {
          console.log(userFromDB)
    
          if (userFromDB !== null) {
            res.render("auth/signup", { message: "Username is already taken" })
          } else {
            // Username is available
            // Hash password
            const salt = bcrypt.genSaltSync()
            const hash = bcrypt.hashSync(password, salt)
            console.log(hash)
    
            // Create user
            User.create({ username: username, password: hash })
              .then(createdUser => {
                console.log(createdUser)
                res.redirect("/login")
              })
              .catch(err => {
                next(err)
              })
          }
        })
})





router.get("/login", (req,res) => res.render("auth/login"));

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
   
    if (email === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }
   
    User.findOne({ email })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
          return;
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
          res.render('users/user-profile', { user });
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });
 
module.exports = router;