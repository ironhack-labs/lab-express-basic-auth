const bcrypt = require("bcryptjs");
const User = require('../models/User.model');
const { Error } = require('mongoose');

const hasCorrectPasswordFormat = (password) => {
    const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/);
    return passwordRegex.test(password);
};

const isMongooseValidationError = (error) =>
 error instanceof Error.ValidationError;

const isMongoError = ({ code: errorCode }) => errorCode === 11000;

const showFormSignUp = async (req,res,next)=>{
    res.render("signup");
};

const showFormLogin = async (req,res,next)=>{
    res.render("login");
};

const userLogin = async(req,res,next) => {
    if(req.session.currentUser){
      return next();
    }
    res.redirect("/login");
};

const main = async(req,res,next) =>{
    res.render("main");
};

const private = async(req,res,next) =>{
    res.render("private");
};


const signUp = async (req, res) => {
    try {
        const {password, email, username} = req.body;
        const hasMissingCredential = !password || !email || !username;
        if(hasMissingCredential) {
            return res.send('Credentials missing');
        }
        if(!hasCorrectPasswordFormat(password)) {
            return res.send('Incorrect password format');
        }
        const isAlreadyUser = await User.findOne({username});
        if(isAlreadyUser) {
            return res.send('User already exists');
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            email,
            passwordHash: hashedPassword,
            username,
        });
        console.log("user", user);
        req.session.currentUser = user;
        return res.send('Successful signup');
    } catch(err) {
        if(isMongooseValidationError(err)){
            return res.send('Validation error: ' + err.message);
        }
        if(isMongoError(err)) {
            return res.send('Mongo error: ' + err.message);
        }
        console.error(err);
    }
};

const login = async (req, res) => {
    try {
        const {password, email} = req.body;
        const hasMissingCredential = !password || !email;
        if(hasMissingCredential) {
            return res.send('Missing credentials');
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.send("User does not exist. Please sign up.");
        }
        const verifiedPassword = await bcrypt.compare(password, passwordHash);
        if(!verifiedPassword) {
            return res.send("Invalid credentials");
        }
        req.session.currentUser = user._id;
        console.log(req.session);
        return res.send("Successful login");
    } catch(err) {
        console.error(err);
    }
};

const logout = (req, res) => {
    req.session.destroy();
    res.send('Successful logout');
};

module.exports = {signUp, showFormSignUp, showFormLogin, login, main, userLogin, private, logout};