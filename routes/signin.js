const router = require("express").Router()
const bcrypt = require("bcryptjs")

//Models
const User = require("../models/User.model")

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


module.exports = router;
