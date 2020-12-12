const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const { Error } = require("mongoose");
const saltRounds = 10;

const signUp = (req, res) => {
    res.render("signup")
}

const logIn = (req, res) => {
    res.render("login")
}

const correctPasswordFormat = (password) => {
  const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/);
  return passwordRegex.test(password);
};

const isMongooseValidationError = (error) => error instanceof Error.ValidationError;


const isMongoError = ({ code: errorCode }) => errorCode === 11000;

const checkUserCredentials = (req, res, next) => {
    const { email, username, password } = req.body;
    const missCredentials = (!email || !username || !password) ? res.send("Some credentials are missing") : next(); 
}

const addUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!correctPasswordFormat(password)) {
            return res.send("incorrect password format");
        }
        const salt = await bcryptjs.genSalt(saltRounds);
        const hashPassword = await bcryptjs.hash(password, salt)
        const  newUser = await User.create({ email, username, passwordHash: hashPassword });
        console.log("newUser", newUser)
        newUser.passwordHash = undefined;
        req.session.currentUser = newUser;
        res.send("User created")
    } catch (err) {
        if (isMongooseValidationError(err)) {
            return res.send("validation error: " + err.message);
        }
        if (isMongoError(err)) {
            return res.send("mongo error: " + err.message);
        }
        console.log(err)
    }
}

const logUserIn = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user= await User.findOne({ email });
        if (!user) {
            res.send("username doesn't exists");
        }
        const checkPass = await bcryptjs.compare(password, user.passwordHash)
        if (!checkPass) return res.send("Incorrect Password")
        user.passwordHash = undefined;
        req.session.currentUser = user;
        return res.send("login successful");
  } catch (err) {
    console.error(err);
  }
}

const logOut = (req, res) => {
  req.session.destroy();
  res.send("logout successful");
};


const getTheCat = (req, res) => {
    const userInSession = req.session.currentUser;
    if (userInSession) return res.render("cat")
    res.send("please login to see the cat")
}

const getTheGif = (req, res) => {
    const userInSession = req.session.currentUser;
    if (userInSession) return res.render("gif")
    res.send("please login to see the gif")
}

module.exports = {signUp, addUser, logIn, logUserIn, checkUserCredentials,logOut, getTheCat, getTheGif }