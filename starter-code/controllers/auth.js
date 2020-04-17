const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.signupView = (req, res) => {
  res.render('auth/signup');
};

exports.signupProcess = async (req, res) => {
  // 1. obtener la niformacion del formulario
  const { username, password } = req.body;
  //2. verificar que recibi la informacion correcta (no me mandaron algo vacio kbrones)
  if (username === '' || password === '') {
    res.render('auth/signup', {
      error: 'No seas cabron, dame la info que te pedi',
    });
    return;
  }
  //3. Verificar si existe un usuario con ese correo
  const userInDB = await User.findOne({ username });

  if (userInDB) {
    res.render('auth/signup', {
      error: 'ya te  registrastes wey, no te acuerdas ?... si no fuiste tu ya te jakiaron compa',
    });
    return;
  }
  //4. Hashear la contrasena
  //4.1 Generar el salt
  const salt = bcrypt.genSaltSync(12);
  const hashPass = bcrypt.hashSync(password, salt);

  //5. si existe devolver un error, si no creamos al usuario

  await User.create({
    username,
    password: hashPass,
  });
  // 6. responder al usuario
  res.redirect(`/${username}`);
};
