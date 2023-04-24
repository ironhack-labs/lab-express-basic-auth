const User = require("../models/User.model");
const router = require("express").Router();
const bcryptjs = require("bcryptjs");

router.get("/signup",(req,res)=>{
    res.render("auth/signup");
});

router.post("/signup",async(req,res)=>{
    console.log(req.body);

const salt = await bcryptjs.genSalt(12);
const hash = await bcryptjs.hash(req.body.password, salt);
console.log(hash);
const user = new User({ email: req.body.email, password: hash });
await user.save();

res.send("signed up");
});

router.get("/login",(req,res)=>{
    res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
  
      console.log(user);
  
      if (!user) {
        return res.render("auth/login", { error: "User not from this planet" });
      }
  
      const passwordsMatch = await bcryptjs.compare(
        req.body.password,
        user.password
      );
  
      if (!passwordsMatch) {
        return res.render("auth/login", {
          error: "Incorrect password!",
        });
      }
    
      console.log(req.body);
      res.render("profile",{userEmail:user.email});
    } catch (err) {
      next(err);
    }
  });

module.exports=router;