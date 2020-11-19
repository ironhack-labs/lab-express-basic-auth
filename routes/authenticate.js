const { Router } = require("express");
const router = Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const app = require("../app");
const salt = 10; // this is the number of times we are hashing the password

//this is the middelware, after we send the request but before we get the response this is checking to see if the user exists, they are then redirected to the index page
const ifAlreadySignedIn = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
};
//this is the middelware, after we send the request but before we get the response this is checking to see if they are user,if not they are then redirected to the index page
const ifNotSignedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  next();
};

//here were getting the end point, in this case the end point is the signup page, but this could be any end point, we can then use any information from the end point
router.get("/signup", ifAlreadySignedIn, (req, res) => {
  res.render("authenticate/signup"); //from the end point we can then render anything, it doesnt have to be a page we could render and object from the end point.
});
/*here we are posting the signup, which gives us the req body, which allows us to "play with the data as Dimitri said"*/
router.post("/signup", ifAlreadySignedIn, (req, res) => {
  //setting the username and password equal to the req.body which is what the user inputs in our form
  const { username, password } = req.body;
  // if there isnt a username input or the password is too short then we want to display an error message, we then link this message to the corresponbing hbs page, also where some simple css styling is applied
  if (!username || password.length < 8) {
    //rendering the error message to be displayed on the signup page
    res.render("authenticate/signup", {
      errorMessage: "Please fill out the form!",
    });
    return;
  }
  User.findOne({ username }) // here we are checking to see if there is already someone with that username, if so then we want to display and error message
    .then((foundUser) => {
      //if thats true then display the error message, this is also linked on the signup hbs using the handlebars
      if (foundUser) {
        res.render("authenticate/signup", {
          errorMessage: "Username is already taken",
        });
        return;
      }
      /*the funky part, using the gen salt and taking in the variable
      salt which we defined to be 10, we hash that password 10 times with some 
      npm magic taking in the paramaters of password and generated salt*/

      bcrypt
        .genSalt(salt)
        .then((generatedSalt) => {
          return bcrypt.hash(password, generatedSalt);
        }) // once weve got that magically hashed password we can pass it on to the user object we are about to create
        .then((hashedPassword) => {
          return User.create({
            username,
            password: hashedPassword, // now we define the password part of the model to be the hashed password for security reasons.
          });
        }) // now we have the user created, we attribute the req.session to the user created, this add a cookie to the cookie jar
        .then((userCreated) => {
          console.log("userCreated:", userCreated);
          req.session.user = userCreated;
          res.redirect("/"); // now redirecting them to the index page but with a twist, using handlebars if they are a user we display something different
        });
    })
    //catch for all of the above code, as promises are asynchronous, so this would catch any that broke on the way down like a big safety net at the
    .catch((err) => {
      console.log("err:", err);
      res.render("authenticate/signup", { errorMessage: err.message });
    });
});
// the login method follows the same logic as above, though here we check to make sure the passwords match using the compare method.
router.get("/login", ifAlreadySignedIn, (req, res) => {
  res.render("authenticate/login");
}); //again same as above but with login
router.post("/login", ifAlreadySignedIn, (req, res) => {
  const { username, password } = req.body;
  if (!username || password.length < 8) {
    res.render("authenticate/login", {
      errorMessage: "Forgotten you're details? or have you not signed up yet?",
    });
    return;
  } //checking the database, the findOne is a mongoose method that we can use
  User.findOne({ username }).then((user) => {
    //checking if the name entered is not a username we recognise in the datebase then display the error below, this is linked to the login hbs in the same manner as the signup.
    if (!user) {
      res.render("authenticate/login", {
        errorMessage: "Sorry it doesnt look like you have an account!",
      });

      return;
    }
    /*time for the magic again, this bcrypt has a method called compare, thank fuck for that, which is going to help us check
    if the password the user enters on the form is the same as that cryptic string we have stroed in our database and somehow 
    it can read that cryptic string with its magic and know if they are the same*/
    bcrypt.compare(password, user.password).then((isSamePassword) => {
      if (!isSamePassword) {
        res.render("authenticate/login", {
          errorMessage:
            "Sorry it doesnt look like you have the right password!",
        });

        return;
      }
      /* however if it is all good and they manage to remeber their password we 
      get that good old req session on for the user, redirect them to the home page 
      but this time itll be their home page thanks to those handlebars which render a 
      different index page for logged in users*/

      req.session.user = user;
      res.redirect("/");
    });
  });
});

//because we have the function redirecting those that arent signed in and the links to these pages only appear when your signed in, they are nice and private to our users.
router.get("/main", ifNotSignedIn, (req, res) => {
  res.render("main");
});
router.get("/private", ifNotSignedIn, (req, res) => {
  res.render("private");
});

module.exports = router;
