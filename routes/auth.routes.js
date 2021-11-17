// routes/auth.routes.js


const router = require("express").Router();

const User = require("./../models/User.model");
const bcrypt = require("bcryptjs");
const zxcvbn = require("zxcvbn");

const saltRounds = 10;

//Routes

// routes /signup


router.get("/signup", (req, res) => {
    res.render("auth/signup-form")
})


// POST /signup 

router.post("/signup", (req, res) => {
    const {username, password } = req.body;
    //check if username and pass are provided
    
    const usernameNotProvided = !username || username === "";
    const passwordNotProvided = !password || password === "";
    
    if (usernameNotProvided || passwordNotProvided) {
        res.render("auth/signup-form", {
            errorMessage: "Provide username and password!"
        });
    
        return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    res.status(400).render("auth/signup-form", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });

    return;
  }


  User.findOne({ username: username})
   .then((foundUser) => {
       if(foundUser) {
           throw new Error("The username is already taken");
       }

       //generating the salt string
       return bcrypt.genSalt(saltRounds);
   })

   .then((salt) => {
       //Encrypt the password
       return bcrypt.hash(password, salt);
   })

   .then((hashedPassword) => {
       //Create new user
       return User.create({ username: username, password: hashedPassword});

   })

   .then((createdUser) => {
       res.redirect("/"); //redirectionar user para o home (já logado)
   })

   .catch((err) => {
       res.render("auth/signup-form", {errorMessage: "Error while trying to sign up"})
   });
});


// LOGIN PART 


//GET /login

router.get("/login", (req, res) =>  {
    res.render("auth/login-form");
})


//POST /login
router.post("/login", (req, res) => {
    const {username , password} = req.body;

    //check if username and password are provided

    const usernameNotProvided = !username || username === "";
    const passwordNotProvided = !password || password === "";

    if(usernameNotProvided || passwordNotProvided) {
        res.render("auth/login-form",  {
          errorMessage : "Provide username and password to login"
        });

        return;
    }

    let user;

    //Check if user exists already

    User.findOne({username: username})
      .then((foundUser) => {
          user = foundUser;

          if(!foundUser){
              throw new Error("Wrong Credentials, try again.")
          }

          //Compare passwords

          return bcrypt.compare(password, foundUser.password);
      })

      .then((isCorrectPassword) => {
            if(isCorrectPassword) {
                req.session.user = user;
                res.redirect("/");
            }
      })

      .catch((err) => {
          res.render("auth/login-form", {
              errorMessage: err.message || "Provide username and password"
          });
      })

})




module.exports = router;