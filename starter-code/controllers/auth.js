const bcrypt = require('bcrypt')
const User = require('../models/User')

exports.signupView = (req, res) => {
  res.render('auth/signup')
}

exports.signupProcess = async (req, res) => {
  // 1. obtener la niformacion del formulario
  const { username, password } = req.body
  //2. verificar que recibi la informacion correcta (no me mandaron algo vacio kbrones)
  if (username === '' || password === '') {
    return res.render('auth/signup', {
      error: 'No seas cabron, dame la info que te pedi',
    })
    
  }
  //3. Verificar si existe un usuario con ese correo
  const userInDB = await User.findOne({ username })

  if (userInDB !== null) {
    return res.render('auth/signup', {
      error: 'ya te  registrastes wey, no te acuerdas ?... si no fuiste tu ya te jakiaron compa',
    })
    
  }
  //4. Hashear la contrasena
  //4.1 Generar el salt
  const salt = bcrypt.genSaltSync(12)
  const hashPass = bcrypt.hashSync(password, salt)

  //5. si existe devolver un error, si no creamos al usuario

  await User.create({
    username,
    password: hashPass,
  })
  // 6. responder al usuario
  res.redirect('/login')
}

exports.loginView = (req, res) => {
  res.render('auth/login')
}

exports.loginProcess = async (req, res) => {
  const { username, password } = req.body
  if (username === '' || password === '') {
    return res.render('auth/login', { error: 'Los datos no pueden estar vacíos' })
  }

  const userInDB = await User.findOne({ username })
  if (userInDB === null) {
    return res.render('auth/login', { error: 'usuario no encontrado' })
  }

  if (bcrypt.compareSync(password, userInDB.password)) {
    req.session.currentUser = userInDB
    res.redirect('/main')
  } else {
    res.render('auth/login', { error: 'Intentalo de nuevo' })
  }
}

exports.logout = async (req, res) => {
  await req.session.destroy()
  res.redirect('/')
}
