const User = require ('../models/User.model');


module.exports.signup = (req, res, next) => {
    res.render('users/signup', { errors : false })
};


module.exports.signin = (req, res, next) => {
    res.render('users/signin')
}

module.exports.dosignup = (req, res, next) => {
    User.create(req.body)
    .then(() => {
        res.redirect("/signin");
      })
      .catch((err) => next(err));
}

module.exports.dosignin = (req, res, next) => {
    const { username, password } = req.body;
  
    const renderWithErrors = () => {
      res.render("users/signin", {
        username,
        errors: true,
      });
    };
    User.findOne({ username })
    .then((user) => {
      if (user) {
        return user.checkPassword(password).then((match) => {
          if (match) {
            console.log("Te has logueado!!");
            res.redirect(`/profile/${user._id}`);
          } else {
            console.log("usuario o contraseña incorrectos"); 
            renderWithErrors();
          }
        });
      } else {
        console.log("usuario o contraseña incorrectos"); 
        renderWithErrors();
      }
    })
    .catch((err) => next(err));
};