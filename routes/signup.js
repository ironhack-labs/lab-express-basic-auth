const User = require("../models/User.model");
const router = require("express").Router();
const bcrypt = require('bcryptjs')

const logoutCheck = function(){
    return (req, res, next) => {
      if (req.session.user === undefined) {
        next()
      } else {
        res.redirect('/profile')
      }
    }
  }


/* GET home page */
router.get("/signup", logoutCheck(), (req, res, next) => {

  res.render("signup", {session: req.session.user});
});


// Sign Up

router.post("/signup", (req, res, next) => {
    const { username, password} = req.body
    if (username === ''){
        res.render('signup', {message: 'Username is empty'})
        return
    }
    if (password.length < 4) {
        res.render('signup', {message: 'Password must be 4 characters or longer'})
        return
    }

    User.findOne({username: username})
    .then(usernameToCheck => {
    if (usernameToCheck !== null) {
        res.render('signup', { message: 'Your username is already taken' })
    }
    else {
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(password, salt)
        console.log(hash)
        // create the user
        User.create({ username: username, password: hash })
            .then(createdUser => {
                console.log(createdUser)
                res.redirect('/login')
            })
            .catch(err => {
                next(err)
            })
        }
    })

    })    

module.exports = router;