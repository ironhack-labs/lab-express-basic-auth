const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");


// Route to render 

router.get('/signup', (req, res)=>{
    res.render("auth/signup");
});

// We also need to connect the rout we created to the redirecting page

router.post("/signup", async (req, res)=>{
    const {username, email, password}= req.body;

    //Check if username and password are filled in
    if (username==="" || password ===""){
        res.render('auth/signup', {errorMessage:"Fill username and password"})
        return;
    }

    //Check if username already exists
    const user = await User.findOne({username: username});
    if (user!==null){
        res.render('auth/signup', {errorMessage:"Username alreay exists"})
        return;
    }

    /* Check for password strength
    -> basically we are saying that the password need to have certain characteristics 
    like first letter mus be uppercased, it mus include at least a number */
    const myRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/; 
    if (myRegex.test(password) === false){
        res.render("auth/signup", {
            errorMessage: "Password is too weak"
        });
        return;
    }


    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds); // -> Geneates a random string password
    const hashedPassword = bcrypt.hashSync(password, salt);
    await User.create({
        username, // -> since the username and email are = to username and email we can just type username unlike in the password field
        email,
        password: hashedPassword,
    });
    res.redirect("/");
});

// Let's add the login route

router.get("/login", (req, res)=>{
    res.render("auth/login");
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (username==="" || password===""){  // -> Another way to write empty string on password and username would be to use the !sign => (!username || !password)
      res.render("auth/login", {
        errorMessage: "Fill username and password",
      });
      return;
    }
    const user = await User.findOne({ username });
    if (!user) {
      res.render("auth/login", {
        errorMessage: "Invalid login credentials",
      });
      return;
    }
    res.render("/");

      //Check for Password:
  if (bcrypt.compareSync(password, user.password)){
    // if the Password Matches lets redirect the user to the books page
    req.session.currentUser = user;  // -> here we are initiallizing the session with the current user in case the passwords match
    res.redirect("/");
    } else{ // If passwords do not match 
    res.render("/", {
        errorMessage: "Invalid login credentials"
    });
    };
});



router.post("/logout", (req, res)=>{
    req.session.destroy();
    res.redirect("/");
})


// allways exprot the rout before you forget
module.exports = router;