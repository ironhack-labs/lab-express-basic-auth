const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

//////////// L O G I N ///////////
// GET route ==> to display the login form to users
router.get("/signup",isLoggedOut, (req, res) => {
  data = { userInSession: req.session.currentUser };
  res.render("auth/signup",data);
});

// POST login route ==> to process form data
router.post("/signup", (req, res,next) => {
  console.log(req.session)
  console.log("the form data", req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage:
        "Please fill in all mandatory fields. Email and Password are required",
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.render("auth/signup", {
      errorMessage:
        "Please input a password: at least 6 characters long, with a lowercase and uppercase letter",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => {
      return bcryptjs.hash(password, salt);
    })
    .then((hashedPassword) => {
      console.log("Hasted Password", hashedPassword);
      return User.create({
        username: username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.redirect("/profile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
    }
    else if(error.code === 11000){
        res.render('auth/signup',{errorMessage:"There is already an account associated with this emaail please sign in or sign up with new email"})
    }
     else {
        next(error);
    }
  });
});

router.get('/login',isLoggedOut, (req,res)=>{
  console.log(req.session)
  res.render('auth/login')
})

router.get('/profile', isLoggedIn, (req, res) => {
res.render('user/user-profile', { userInSession: req.session.currentUser });
});

router.post('/login',(req,res)=>{
  console.log("SESSION =====>", req.session)
  console.log(req.body)
  const {user,password} = req.body

   if(!user || !password){
      res.render('auth/login',{errorMessage:'please enter an email or password'})
  return
  }
 
  User.findOne({user})
  .then(user=>{
      console.log(user)
      if(!user){
          res.render('auth/login',{errorMessage:"User not found please sign up. No account associated with email"})
      }
  
      else if(bcryptjs.compareSync(password,user.passwordHash)){
    
          req.session.currentUser = user
          res.redirect('/profile')
      }
      else{
          res.render('auth/login',{errorMessage:"Incorrect Password"})
      }

  })
  .catch(error=>{
      console.log(error)
  })

})






router.get("/profile", (req, res) => {
  res.render("user/user-profile");
});

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/login');
  });
});



module.exports = router;
