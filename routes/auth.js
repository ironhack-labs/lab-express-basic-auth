const router = require("express").Router()
const bcrypt = require("bcryptjs")

//Models
const User = require("../models/User.model")


//Middleware
const {isLoggedOut} = require("../middleware/route-guard")


/* GET home page */
router.get("/signin", (req, res, next) => {
  res.render("signin");
});


/* POST create new user */
router.post("/signin", async (req, res)=>{
  
    const {username, password} = req.body;
  
    try{
      const hashedPassword = await bcrypt.hash(password, 10)
  
      const createdUser = await User.create({username, password: hashedPassword})
      res.render("signin.hbs", {justCreatedUser: createdUser.username})
    }catch(err){
      console.log(err)
    }
  
})

//GET route to login

router.get("/login", (req, res)=>{
  res.render("login")
})


//POST log in

router.post('/login', async (req, res)=>{
  const {username, password} = req.body

  if(!username || !password){ 
    res.render("login", {errorMsg: "You need to fill all inputs"})
  }

  const userFromDB = await User.findOne({username})
  if(!userFromDB){ 
    res.render("login", {errorMsg: "The user does not exist"})
  } else { 
    const passwordsMatch = await bcrypt.compare(password, userFromDB.password)
    if(!passwordsMatch){ 
      res.render("login", {errorMsg: "Incorrect password"})
    } else {
      
      req.session.loggedUser = userFromDB
      console.log('SESSION ======> ', req.session)
      res.redirect('/private')
    }
  }
})


//POST logout 
router.post('/logout', async (req, res, next) => {
  
  res.clearCookie('connect.sid', {path: '/',})

  try{
    await req.session.destroy()
    res.redirect('/login')
  }catch(err){
    next(err)
  }

})

module.exports = router;


module.exports = router;
