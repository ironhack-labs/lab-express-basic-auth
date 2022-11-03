const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
// GET route ==> to display the signup form to users
 
router.get('/', (req, res) => {
    res.render('auth/signup')
});



// POST route ==> to process form data
 
router.post('/', async (req, res, next) => {
  const {email, password} = req.body
  try {
    const salt = bcryptjs.genSaltSync(saltRounds)
    const hash = bcryptjs.hashSync(password, salt)
    const userDb = await User.create({
        email,
        password: hash
    })
     console.log(userDb)
     res.redirect('/signUp/login')
  }catch (err) {
    console.log(err)
  }
});

router.get("/login", (req, res) => {
    res.render("auth/login")
  })
  
router.post("/login", async(req, res) => {
  const { email, password } = req.body


  try {
    const userDb = await User.findOne({email})
    console.log(userDb)
    if (!userDb) {
      res.render("auth/login", { errorMessage: "Email is not registered, Try another one" })
    } else if (bcryptjs.compareSync(password, userDb.password)){
      res.render("users/user-profile", {userDb})
    } else {
      res.render("auth/login", { errorMessage: "Incorrect password, Try again" })
    }
  }catch (err) {
    console.log(err)
  }
})
  

 router.get('/userProfile', (req, res) => {
    res.render('users/user-profile')
 });



module.exports = router;