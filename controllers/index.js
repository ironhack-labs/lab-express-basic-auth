const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs')
const { Error } = require('mongoose');

const register = (req, res) => {
    res.render('register')
}

const hasCorrectPasswordFormat = password => {
    //min 6 char + 1 capital letter + 1 number + 1 lowe case letter
    const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)
    return passwordRegex.test(password)
}

const isMongooseValidationError = (error) => {
    error instanceof Error.ValidationError
}

const createUser = async (req, res) => {
    try {
        const { username, password } = req.body
        
        const isMissingCredentials= !password || !username
        if(isMissingCredentials) {
            return res.send("Missing Credentials")
        }

        const userExist = await User.findOne({username})
        console.log("UserExist", userExist, username, password)
        if (userExist) {
            return res.send("User already created")
        }

        if(!hasCorrectPasswordFormat(password)) {
            return res.send("incorrect password format")
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds)
        console.log('salt', salt)
        const hashPassword = await bcrypt.hash(password, salt)
        console.log('password', hashPassword)

        const userCreated = await User.create({username, password: hashPassword})
        console.log('usercreated', userCreated)
        
        req.session.currentUser = userCreated 
        console.log(req.session)

        res.send("user succesfully created!")


        }catch (err) {
            if (isMongooseValidationError(err)) {
                return res.render("/signup", {error: "validation error"})
            }
        console.error(err)
        }
} 

const loginUser = async(req, res) => {
    try {
        const { username, password } = req.body

        if(!username || !password) {
            res.send("Provide both fields")
        }

        const userExists = await User.exists({username: username})
        console.log("userexist", userExists)
        if (!userExists) {
            res.send("User not created, please register")
        }

        const user = await User.findOne({ username })
        console.log("user", user)
        const checkCredentials = await bcrypt.compare(password, user.password)
        if(!checkCredentials) {
            return res.send('Wrong credentials')
        }

        req.session.currentUser = user._id;
        console.log(req.session)
        res.render('main')

    } catch (err) {
        console.error(err)
    }
}

const logout = (req, res) => {
    req.session.destroy();
    res.render('logout')
}

const auth = (req, res, next) => {
    if (!req.session.currentUser){
        res.send("You are not logged in!")
    }
    next()
}

const private = (req, res) => {
    res.render("private")
}


module.exports = { register, createUser, loginUser, logout, private, auth }