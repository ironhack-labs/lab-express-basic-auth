//Validar si el usuario no esta logeado
//Areas privadas: Areas solo accesibles para usuarios logeados
const usuarioLoggeado = (req, res, next) => {
  if (!req.session.currentUser) {
    //si no esta logeado, no le permite el acceso a las rutas y lo redirige al login
    res.redirect("/auth/login");
    return;
  }
  // SI SÍ ESTÁ LOGGEADO ENVIARLO A LA SIGUIENTE FUNCIÓN (CONTROLLER)
  next();
};

//AREAS DE AUTENTICACION: EL USUARIO YA SE AUTENTICO Y QUIERE ENTRAR A LAS AREAS DE SIGUP Y LOGIN. POR LO TANTO LO REDIRIGIMOS AL HOME
const usuarioInvitado = (req, res, next) => {
  //evaluar si esta autenticado
  //si esta autenticado...
  if (req.session.currentUser) {
    return res.redirect("/users/main");
  }

  //SI NO ESTA AUITENTICADO, DEJALO PASAR AL LOGIN
  next();
};
module.exports = {
  usuarioLoggeado,
  usuarioInvitado,
};
