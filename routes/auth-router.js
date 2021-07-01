const express = require("express");
const authRouter = express.Router();
const User = require("../models/User.model");


const bcrypt = require("bcryptjs"); // standard library for cryptography
const saltRounds = 3; // should change this number to give your website a unique randomness (salt makes it random)

const zxcvbn = require("zxcvbn");


//GET '/auth/login'
authRouter.get("/login", (req, res) => {
  console.log("Inside login")
  res.render("login-form");
});

authRouter.post('/login', (req, res) => {
  const {username, password} = req.body

  if (username === "" || password === "") {
    res.render("login-form", { errorMessage: "Username and Password are required." });
    return;
    }
  
  User.findOne({username})
  .then(user => {
      if (!user) {
        res.render("login-form", { errorMessage: "Input invalid" });
      } else {
        const encryptedPassword = user.password;
        const passwordCorrect = bcrypt.compareSync(password, encryptedPassword)
        
        if(passwordCorrect){
          req.session.currentUser = user;
          res.redirect("/")
        } else {
          res.render("login-form", {errorMessage: "Name OR password incorrect"});
        }
        }
    })
  })


// GET    '/auth/signup'     -  Renders the signup form
authRouter.get("/signup", (req, res) => {
  res.render("signup-form"); // want the user to go to the signup page and want to send back to them a signup form (see signup-form.hbs)
});

// POST    '/auth/signup'
// this post will post the form made in signup-form.hbs
authRouter.post("/signup", (req, res, next) => {
  // 1. Get the username and password from req.body
  const { username, password } = req.body;
  console.log('insdie signup', req.body)

  // 2.1 Check if the username and password are provided, if not:
  if (username === "" || password === "") {
    res.render("signup-form", {
      errorMessage: "Username and Password are required.",
    });
    return; // stops the execution of the function furhter
  }

  // 2.2 Verify the password strength - this is grey because it's not the best method
  // const passwordStrength = zxcvbn(password).score; // zxcvbn is a library that checks password strength (see line 8)

  // console.log("zxcvbn(password) :>> ", zxcvbn(password));
  // console.log("passwordStrenth :>> ", passwordStrength);
  // if (passwordStrength < 3) {
  //   res.render("auth-views/signup-form", {
  //     errorMessage: zxcvbn(password).feedback.warning,
  //   });
  //   return;
  // }

  //************* COPY AND PAST THIS INTO YOUR PROJECT */
  // 3. Check if the username is not taken - to do this we search our database by username. .find() takes an object if it is not left empty .find({})
  User.findOne({ username })
    .then((userObj) => {
      if (userObj) {
        // if user was found
        res.render("signup-form", {
          errorMessage: `Username ${username} is already taken.`,
        });
        return;
      } else {
        // Allow the user to signup if above conditions are ok

        // 4. Generate salts and encrypt the password - this is made using libraries, it is copy paste (not creative)
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt); // you must has the password BEFORE creating the user
        //we are inside a .then (line 43), saying that these things need to happen in order - we need to know if the user exists BEFORE creating a new user

        // 5. Create new user in DB, saving the encrypted password
        User.create({ username, password: hashedPassword }) // you need to save the hashedPassword as this is the random string
        // this shows that in our model we will need to create username and password
        // we should also make them required and make username unique (double protection)
          .then((user) => {
            // 6. When the user is created, redirect (we choose - home page)
            res.redirect("/");
          })
          .catch((err) => {
            res.render("signup-form", {
              errorMessage: `Error during signup`,
            });
          });
      }
    })
    .catch((err) => next(err));

  // X.  Catch errors coming from calling to User collection
});


authRouter.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err){
      res.render("error", { message: "Something went wrong! Yikes!" });
    }else{
      res.redirect('/')
    }
  })
})

module.exports = authRouter;