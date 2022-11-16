const { Router } = require("express")
const router = new Router()

const bcryptjs = require("bcryptjs")

const User = require("../models/User.model")
const saltRounds = 10

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');



    router.get("/signup", (req, res, next) =>{
        res.render("auth/signup")
    })

    router.post("/signup", (req, res, next) =>{
       const {username, passwordHash} = req.body

       bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(passwordHash, salt))
        .then(hashedPassword => {
            console.log(hashedPassword)
            return User.create({
                username,
                passwordHash: hashedPassword
            })
        
        //    console.log(`Password hash: ${hashedPassword}`);
        })
        .then(userFromBD => {
        //    console.log("new user is: ", userFromBD)
        res.redirect('/userProfile')
        })

    .catch(error => next(error));
    })

    router.get("/userprofile", isLoggedIn, (req, res, next) => {
        res.render('users/user-profile', { userInSession: req.session.currentUser })
    })

/*     .--.      .-'.      .--.      .--.      .--.      .--.      .`-.      .--.
    :::::.\::::::::.\::::::::.\::::::::.LOGIN\::::::::.\::::::::.\::::::::.\::::::::.\
    '      `--'      `.-'      `--'      `--'      `--'      `-.'      `--'      `
 */

    router.get('/login', (req, res) => {
        res.render('auth/login')
    })

    router.post("/login", (req,res,next) =>{

        const {username, passwordHash} = req.body
        console.log('SESSION =====> ', req.session)

        if(username === "" || passwordHash === ""){
            res.render("auth/login", {
                errorMessage: "Please enter both, email and password to login"
            })
            return
        }

        User.findOne({username})
            .then(user =>{
                if (!user){
                    res.render("auth/login", {errorMessage : "This user does not exist. Try another username."})
                    return
                }
                else if (bcryptjs.compareSync(passwordHash, user.passwordHash)) {
                    console.log(user)
                    //res.render("users/user-profile", {user})

                    req.session.currentUser = user
                    res.redirect('/userProfile')
                }
                else {
                    res.render("auth/login", {errorMessage: "Incorrect password."})
                }
            })
            .catch(err => next(err))
    })

    router.post('/logout', (req, res, next) => {
        req.session.destroy(err => {
          if (err) next(err);
          res.redirect('/');
        });
      });


module.exports = router