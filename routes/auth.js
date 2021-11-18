const router = require("express").Router();
const bcrypt = require("bcryptjs")
const {isLoggedOut} = require("../middleware/route-guard")

//Models
const User = require("../models/User.model")

/* GET form to create new user */
router.get("/signup", (req, res) => {
  res.render("createUser");
});

router.get("/login", isLoggedOut, (req, res)=>{
  res.render("login")
})

/* POST create new user */
router.post("/signup", isLoggedOut, async (req, res)=>{

  const {username, password} = req.body; 

  try{

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await User.create({username, password: hashedPassword})
    res.render("createUser.hbs", {justCreatedUser: createdUser.username})
  }catch(err){
    console.log(err)
  }

})

// POST log in

router.post('/login', async (req, res)=>{
  const {username, password} = req.body

  if(!username || !password){ //Si dejan algun campo vacio
    res.render("login", {errorMsg: "You need to fill all inputs"})
  }

  const userFromDB = await User.findOne({username})
  if(!userFromDB){ //Si el usuario no existe
    res.render("login", {errorMsg: "The user does not exist"})
  } else { //Si el usuario existe
    const passwordsMatch = await bcrypt.compare(password, userFromDB.password)
    if(!passwordsMatch){ //Si la contraseña introducida no es correcta
      res.render("login", {errorMsg: "Incorrect password"})
    } else {
      req.session.loggedUser = userFromDB
      console.log('SESSION ======> ', req.session)
      res.redirect('/')
    }
  }
})

//POST logout 
router.post('/logout', async (req, res, next) => {
  
  res.clearCookie('connect.sid', {path: '/',})

  try{
    await req.session.destroy()
    res.redirect('/')
  }catch(err){
    next(err)
  }

})

module.exports = router;