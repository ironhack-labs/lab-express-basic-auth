const User = require('../models/User.model')
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const newUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const randomString = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, randomString)
        const newUser = await User.create({ username, email, password: hashedPassword })
        req.session.currentUser = user._id;
        res.redirect('/')
        console.log('NEW USER:', newUser)
    } catch (err) {
        console.log('There is an error:', err)
    }
}

const checkCredentials = (req, res, next) => {
    const { username, email, password} = req.body;
    const hasMissingCredential = !username || !email || !password;
    if (hasMissingCredential) {
      return res.send("All fields are mandatory"); //, {error: 'All fields are mandatory'}
    }
    next();
};

const login = async (req, res) => {
    try {
        const {username, email, password} = req.body
        const user = await User.findOne({ email, username })
        if (!user) {
            console.log('User does not exist!!!!!!')
            return res.send('User does not exist')
        }
    
        const verifyPassword = await bcrypt.compare(password, user.password)
        if (!verifyPassword) {
            console.log('Incorrect password!!!!!!')
            return res.send('Incorrect password')
        }
        console.log('USER IS:', user)
        req.session.currentUser = user._id;
        res.redirect('/main')
    } catch (err) {
        console.log('Error Here!!!!!',err)
    }
}

const logout = (req,res)=> {
    req.session.destroy()
    console.log('logged out!!!!')
    res.redirect('/')
}

const logInCheck = (req, res, next) => {
    if (!req.session.currentUser) {
        res.send('You are not logged in!')
    }
    next()
}

module.exports = {
    newUser,
    checkCredentials,
    login,
    logout,
    logInCheck
}