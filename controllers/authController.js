const User = require('./../models/User.model')
const bcryptjs = require('bcryptjs')
exports.viewRegister = (req, res) => {
      res.render('auth/signup')
}

exports.register = async (req, res) => {
      const username = req.body.username
      const password = req.body.password
      console.log(username, password)
      if (!username || !password) {
            res.render("auth/signup", {
                  errorMessage: "Uno o más campos están vacíos. Revísalos nuevamente."
            })
            return
      }
      const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      if (!regex.test(password)) {
            res.render("auth/signup", {
                  errorMessage: "Tu password debe de contener 6 caracteres, un número y una letra mayúscula."
            })
            return
      }

      try {
            const salt = await bcryptjs.genSalt(10);
            const passwordEncriptado = await bcryptjs.hash(password, salt);
            const newUser = await User.create({
                  username,
                  passwordEncriptado
            })
            console.log(newUser);
            res.redirect('/auth/login')

      } catch (error) {
            console.log(error)
            res.status(500).render("auth/signup", {
                  errorMessage: "Hubo un error con la validez de tu correo. Intenta nuevamente. No dejes espacios y usa mayúsculas."
            })
      }
}

exports.viewLogin = async (req, res) => {
      res.render('auth/login')
}

exports.login = async (req, res) => {
      try {
            // Aqui vamos a traernos los datos que aparecen en el formulario del login.
            const username = req.body.username
            const password = req.body.password
            //Validamos los datos del usuario encontrado en la base de datos.
            const foundUser = await User.findOne({username})
            if (!foundUser) {
                  res.render('auth/login', {
                      errorMessage: 'Email o contraseña sin coincidencia',
                  });
                  return
            }
            //Aqui comparamos la contraseña del formulario del login vs la contraseña de la base de datos.
            const verifiedPass = await bcryptjs.compareSync(password, foundUser.passwordEncriptado,)

            if (!verifiedPass) {
                  res.render('auth/login', {
                        errorMessage: "Email o contraseña erronea. Intenta nuevamente"
                  });
                  return
            }
            //Aqui generamos la persistencia de identidad.
            req.session.currentUser = {
                  _id: foundUser._id,
                  username: foundUser.username,
            }
            //Redireccionamos al Home
            res.redirect('/users/profile')
      } catch (error) {
            console.log(error);
      }
}

exports.logout = async (req, res) => {
      req.session.destroy((error) => {
            // se evalua si hubo algun error al borrar la cookie
            if (error) {
                  console.log(error);
                  return
            }
            res.redirect("/")
      })
}

