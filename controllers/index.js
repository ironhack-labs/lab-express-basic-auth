const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs')

const createUser = async (req, res) => {
    try {
        const { username, password } = req.body
        
        if(!username || !password) {
            res.send("Provide both fields")
        }

        const userExist = await User.exists({username: username})
        if (userExist) {
            return res.send("This user alredy created")
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds)
        console.log('salt', salt)
        const hashPassword = await bcrypt.hash(password, salt)
        console.log('password', hashPassword)

        const userCreated = await User.create({username, password: hashPassword})
        console.log('usercreated', userCreated)
        res.send("user succesfully created!")
        }catch (err) {
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
        if (checkCredentials) {
            console.log("hashpassword", user.password)
            res.send('You are logged in')
        } else {
            res.send('Wrong credentials')
        }

    } catch (err) {
        console.error(err)
    }
}



module.exports = { createUser, loginUser }