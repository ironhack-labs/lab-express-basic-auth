const router = require("express").Router();
const chalk  = require('chalk')
const bcrypt = require("bcryptjs");

//Models
const User = require("../models/User.model");

const {isLoggedOut} = require("../middleware/route-guard")

/* GET home page */
router.get("/signup", (req, res, next) => {
    res.render("users/createUser");
  });

router.get("/login", isLoggedOut, (req, res) => {
    res.render("users/login");
  });

/* POST create new user */
router.post("/signup", isLoggedOut, async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password){
        res.render('users/createUser', {errorMsg: "You need to fill all inputs"})
    } const userFromDB = await User.findOne({ username });
    if(userFromDB) {
        res.render("users/createUser", { errorMsg: "The user already exists" });
    }
    else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await User.create({
        username,
        password: hashedPassword,
      });
      res.render("users/createUser", { justCreatedUser: createdUser.username });
    }
})
    

router.post('/login', async (req, res)=>{
    const { username, password } = req.body;

    if(!username || !password) {
        res.render('users/login', {errorMsg: 'You need to fill all inputs'})
    }
    const userFromDB = await User.findOne({ username });
    if(!userFromDB) {
        res.render("users/login", { errorMsg: "The user does not exist" });
    } else {
        const passwordsMatch = await bcrypt.compare(password, userFromDB.password)
        if(!passwordsMatch){
            res.render("users/login", {errorMsg: "Incorrect password"})
        }else {
            req.session.loggedUser = userFromDB 
            console.log('SESSION ======> ', req.session)
            res.redirect(`/`)
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