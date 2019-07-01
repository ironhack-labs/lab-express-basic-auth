const bcrypt = require('bcrypt')
const User = require('../models/User')

//-------------------------SIGN UP---------------------------//
exports.getSignUp = (req, res) => {
  res.render('auth/signup')
}

exports.postSignUp = async (req, res) => {
  const { username, password } = req.body

  const salt = bcrypt.genSaltSync(10)
  const hashPassword = bcrypt.hashSync(password, salt)

  //Revisar si el usuario ya existe
  const users = await User.find({ username })
  if(users.length !== 0){
    return res.render('auth/signup', {
      errorMessage: 'User already exists'
    })
  }

  //Verificar si se recibieron usuario y contraseña
  if(username === ''){
    return res.render('auth/signup', {
      errorMessage: 'Empty username'
    })
  } 
  if(password === ''){
    return res.render('auth/signup', {
      errorMessage: 'Empty password'
    })
  } 

  //Crear usuario en la base de datos
  await User.create({ username, password: hashPassword})
  res.redirect('/auth/login')
}
//----------------------------------------------------------//

//-------------------------LOG IN---------------------------//
exports.getLogin = (req, res) => {
  res.render('auth/login')
}

exports.postLogin = async (req, res) => {
  const { username, password } = req.body

  //Verificar si se recibieron usuario y contraseña
  if(username === ''){
    return res.render('auth/login',{
      errorMessage: 'Empty username'
    })
  }
  if(password === ''){
    return res.render('auth/login', {
      errorMessage: 'Empty password'
    })
  }

  //Verificar que exista un usuario con ese username
  const user = await User.findOne({ username })
  if(!user){
    return res.render('auth/login', {
      errorMessage: "User doesn't exist. Try again"
    })
  }

  //Comparar la contraseña que introdujo el usuario con la que está registrada en la db
  if(bcrypt.compareSync(password, user.password)){
    req.session.currentUser = user
    res.redirect('/menu')
  } else {
    res.render('auth/login', {
      errorMessage: 'Invalid password'
    })
  }
}
//----------------------------------------------------------//