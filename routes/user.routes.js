const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const router = require("express").Router();


router.get('/signup', (req,res) => {
    res.render("signup");
});

router.post('/signup', async (req,res) => {
    const salt = await bcryptjs.genSalt(12);
    const hash = await bcryptjs.hash(req.body.password, salt);
    const user = new User({ email: req.body.email, password: hash});
    await user.save();

    // const user = await User.create({ email: req.body.email, password: hash })

    res.send("<h1>Signed up</h1>")
})



module.exports = router;