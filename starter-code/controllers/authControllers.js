//This contains all the functions that take charge of all the logic.

//We require the .env file
require('dotenv').config()

//Here we bring the user model.
const user = require('../models/User')
const bcrypt = require('bcrypt')



exports.signUpPost = async (req, res) => {
  const { username, password } = req.body
    if (username == '') return res.redirect('/auth/signup') 
    const findUser = await user.find({ username: username })
    console.log('find', findUser);
    
    if (findUser.length) return res.redirect('/auth/signup')
    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashPassword = await bcrypt.hash(password, salt)
    await user.create({username, password: hashPassword}) 
    console.log(username, hashPassword);
    
    res.redirect('/auth/signup')
}

exports.loginPost = async (req, res) => {
  console.log('logging');
  
  const { username, password } = req.body
  if (username == '' && password == '') return res.redirect('/auth/login') 
    const findUser = await user.findOne({ username: username })
    if (!findUser) {
      return res.redirect('/auth/login')
    } else {
      const trusted = await bcrypt.compare(password, findUser.password)
      if (trusted) {
        console.log('paso', findUser);
        
        req.session.loggedUser = findUser
        return res.redirect('/main')
      } else {
        //err = 'El usuario o contraseña es incorrecto'
        return res.redirect('/auth/login')
      }
    }
    
}

exports.loginView = async (req, res) => {
  res.render('login')
}

exports.signUpView = (req, res) => {
  res.render('signup')
}