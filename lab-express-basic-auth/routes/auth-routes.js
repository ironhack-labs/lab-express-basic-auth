const express = require("express");
const authRoutes = express.Router();
const User = require("../models/User");
// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.post("/", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
        username,
        password: hashPass
    });
    if (username === "" || password === "") {
        res.render("index", {
            errorMessage: "Indicate a name or password"
        });
        return;
    }
    User.findOne({ "username": username })
        .then(user => {
            if (user !== null) {
                res.render("index", {
                    errorMessage: "The username already exists"
                });
                return;
            }

            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            const newUser = User({
                username,
                password: hashPass
            });

            newUser.save()
                .then(user => {
                    res.redirect("/");
                })
        })
        .catch(error => {
            next(error)
        })


});


//login

authRoutes.get("/login", (req, res) => {
    res.render("login");
});

authRoutes.post("/login", (req, res, next) => {
    const { username, password } = req.body;
    // Check password
    User.findOne({ "username": username })
    .then(user => {
        if (username === "" || password === "") {
            throw new Error("Indicate a username and a password to sign up");
        }
        // Check user does not exist
        if (!user) throw new Error("The username doesn't exist");
        // Check password hash is correct
        if (!bcrypt.compareSync(password, user.password)) {
            throw new Error("Incorrect Password");
        }
        // Save the login in the session!
        req.session.currentUser = user;
            console.log(`LOGGED AS USER ${user.username}`);
            res.redirect("/");
        })
        .catch(e => {
            res.render("login", {
                errorMessage: e.message
            });
        });


})


//const {username, password} = req.body;
//   // Check password promise
//   let passCheck = new Promise ((resolve, reject) => {
//     if (username === "" || password === ""){
//       return reject(new Error("Indicate a username and a password to sign up"));
//     }
//     resolve();
//   }) 
//   // Check password
//   passCheck.then(() => {
//     return User.findOne({ "username": username })
//   }) 
//   .then( user => {
//     // Check user does not exist
//     if(!user) throw new Error("The username doesn't exist");
//     // Check password hash is correct
//     if (!bcrypt.compareSync(password, user.password)){
//       throw new Error("Incorrect Password");
//     }
//     // Save the login in the session!
//     req.session.currentUser = user;
//     console.log(`LOGGED AS USER ${user.username}`);
//     res.redirect("/");
//   })
//   .catch( e => {
//     res.render("auth/login", {
//       errorMessage: e.message
//     });
//   });
// });



/* authRoutes.get("/", (req, res, next) => {
    res.render("index");
}) */

module.exports = authRoutes;