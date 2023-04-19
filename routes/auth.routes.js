
const router = require("express").Router();

const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

require("../db");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});


router.post("/signup", async (req, res) => {
    console.log(req.body)
    
    const salt = await bcryptjs.genSalt(12);
const hash = await bcryptjs.hash(req.body.password, salt);
const user = new User({ username: req.body.username, password: hash });
await user.save();
res.send("signed up");
console.log(hash)
})
module.exports = router;