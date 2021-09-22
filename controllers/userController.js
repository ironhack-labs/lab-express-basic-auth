const bcryptjs = require('bcryptjs')
const saltRounds = 10
const User = require('./../models/User.model')

//Cargamos el formulario de crear usuario
exports.signup = async (req, res) => {
  res.render('users/signup')
}
//Lee el forumulario
exports.signupForm = async (req, res) => {
  const { username, password } = req.body
  //Base de encriptacion
  const salt = await bcryptjs.genSalt(saltRounds)
  //Mezcla las password
  const hashedPassword = await bcryptjs.hash(password, salt)

  const newUser = await User.create({
    username,
    passwordHash: hashedPassword
  })
  console.log(newUser)
  res.redirect('/')
}

exports.loginUser = async (req, res) => {
  res.render('users/login')
}

exports.loginUserForm = async (req, res) => {
  const { username, password } = req.body

  //Validacion de que no haya datos vacios
  if (username === '' || password === '') {
    return res.render('users/login', {
      errorMessage: 'Favor de llenar los campos'
    })
  }

  try {
    const foundUser = await User.findOne({ username })
    //SI el usuario no existe
    if (!foundUser) {
      return res.render('users/login', {
        errorMessage: 'El usuario o password son erroneas'
      })
    }
    //Comparacion de la contrasena del form con el password
    const isMatched = await bcryptjs.compareSync(password, foundUser.passwordHash)

    //SI no coincide la contrasena
    if (isMatched == false) {
      return res.render('users/login', {
        errorMessage: 'El usuario o la contraseña son erróneas. Intenta nuevamente'
      })
    }

    req.session.currentUser = foundUser
    console.log(req.session.currentUser)

    //SI coincide
    return res.render('users/profile', {
      foundUser
    })
  } catch (error) {
    console.log(error)
  }
}

exports.createProfile = async (req, res) => {
  res.render('users/profile', { foundUser: req.session.currentUser })
}
