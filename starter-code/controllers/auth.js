const bcrypt = require('bcrypt')
const User = require('../models/User')

exports.vistaSignup = (req, res) => {
  res.render('auth/signup')
}

exports.procesoSignup = async (req, res) => {
  const { username, password } = req.body

  if (username === '' || password === '') {
    return res.render('auth/signup', { error: 'Error' })
  }

  const userinDB = await User.findOne({ username })

  if (userinDB !== null) {
    return res.render('auth/signup', { error: 'Existe' })
  }

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)

  await User.create({ username, password: hash })
  res.redirect('/')
}

exports.vistaLogin = (req, res) => {
  res.render('auth/login')
}

exports.procesoLogin = async (req, res) => {
  const { username, password } = req.body

  if (username === '' || password === '') {
    return res.render('auth/login', { error: 'Verifica los campos' })
  }
  const userInDB = await User.findOne({ username })

  if (userInDB === null) {
    return res.render('auth/login', { error: 'El usuario no esta registrado' })
  }
  if (bcrypt.compareSync(password, userInDB.password)) {
    req.session.currentUser = userInDB
    res.redirect('/profile')
  } else {
    res.render('auth/login', { error: 'contraseña o usuario inválido, verifique los campos' })
  }
}

// exports.loginProcess = async (req, res) => {
//   // 1. Obtenemos la informacion que nos enviaron desde el cliente
//   const { email, password } = req.body;
//   //2. Verificar no tener campos vacios
//   if (email === "" || password === "") {
//     return res.render("auth/login", { error: "Te quieres morir ese?" });
//   }
//   //3. Buscamos el correo que nos enviaron en la base de datos, si no existe... error
//   const userInDB = await User.findOne({ email });

//   if (userInDB === null) {
//     return res.render("auth/login", { error: "no te encontre we" });
//   }
//   //4.Si existe verificamos si la contraseña coincide, si es asi, MAGIIAA, si no error
//   if (bcrypt.compareSync(password, userInDB.password)) {
//     req.session.currentUser = userInDB;
//     res.redirect("/profile");
//   } else {
//     res.render("auth/login", { error: "estas seguro que es tu cuenta bro?" });
//   }
// };
