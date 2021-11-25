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
            res.redirect('/')

      } catch (error) {
            console.log(error)
            res.status(500).render("auth/signup", {
                  errorMessage: "Hubo un error con la validez de tu correo. Intenta nuevamente. No dejes espacios y usa mayúsculas."
            })
      }
}

