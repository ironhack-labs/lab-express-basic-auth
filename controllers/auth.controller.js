const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const signUp = (req, res) => {
    res.render("signup")
}

const logIn = (req, res) => {
    res.render("login")
}

const checkUserCredentials = (req, res, next) => {
    const { username, password } = req.body;
    const missCredentials = (!username || !password) ? res.send("Some credentials are missing") : next(); 
}

const addUser = async (req, res) => {
    const { username, password } = req.body;
    const findUser = await User.findOne({ username });
    console.log("user", findUser)
    if (findUser) {
        res.send("username already exists");
    }
    const salt = await bcryptjs.genSalt(saltRounds);
    const hashPassword = await bcryptjs.hash(password, salt)
    const newUser = await User.create({ username, passwordHash: hashPassword })
    console.log("newUser", newUser)
    res.send("User created")
}

const logUserIn = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        res.send("username doesn't exists");
    }
    const checkPass = await bcryptjs.compare(password, user.passwordHash)
    const logIn = (checkPass) ? res.send("Login correctly") : res.send("Incorrect Password")
}

module.exports = {signUp, addUser, logIn, logUserIn, checkUserCredentials}