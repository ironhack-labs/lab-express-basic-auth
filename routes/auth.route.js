const router = require("express").Router();
const User = require('./../models/User.model');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10; // To encript the password in bcrypt


router.get("/signup", (req, res, next) => {
  res.render("auth/signup-form");
});

router.post('/signup', async (req, res) => {
  try {
    const {username, password} = req.body;
  
    const usernameNotProvided = !username || username === "";
    const passwordNotProvided = !password || password === "";
  
    if(usernameNotProvided || passwordNotProvided){
  
      res.render('auth/signup-form', {errorMessage: "Provide username and password"});
  
      return
    }
  
    // Check if the username is taken
    const foundUser = await User.findOne({username: username});
    if(foundUser){
      
      throw new Error("The username is taken");
    }

    // Encrypt the password

    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in the db with the username and hashpw

    const createdUser = await User.create({username: username, password: hashedPassword});

    res.redirect('/')

  } catch (err) {
    res.render("auth/signup-form", {
   errorMessage: err.message || "Error while trying to sign up",
              });
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login-form");
});

router.post("/login", async (req, res, next) => {

  try {
          // Input validation     
  const {username, password} = req.body;
        
  const usernameNotProvided = !username || username === '' 
  const passwordNotProvided = !password || password === '' 
  
  if(usernameNotProvided || passwordNotProvided) {
    res.render('auth/login-form', {errorMessage: "Provide username and password"}); 
          return; 
      };

  // Check if user exists
  
  const foundUser = await User.findOne({username: username});
        if (!foundUser){
          throw new Error ('Wrong credentials!')
        };

  const isCorrectPassword = await bcrypt.compare(password, foundUser.password);     

        if (!isCorrectPassword){
          throw new Error ('Wrong credentials!')
        } else if (isCorrectPassword){
          req.session.user = foundUser;
          res.redirect('/');
        }


  } catch (error) {
                res.render('auth/login-form', {errorMessage: "Add username and password"}); 
  }    

});


module.exports = router;
