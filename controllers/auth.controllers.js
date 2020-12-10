const bcrypt = require("bcryptjs");
const User = require('../models/User.model');

const signup = async (req, res) => {
    try {
        const {username, password} = req.body;
        const hasMissingCredential = !username || !password;
        if(hasMissingCredential) {
            return res.send('credentials missing');
        }
        const isAlreadyUser = await User.findOne({username});
        if(isAlreadyUser) {
            return res.send('user already exists');
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashPassword = await bcrypt.hash(password);
        const user = await User.create({username, password});
        console.log("user", user);
        res.send('user created successfully');
    } catch(err) {
        console.error(err);
    }
};

module.exports = {signup};