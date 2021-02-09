//Creamos el controlador que nos devuelve la vista del user de la carpeta views

module.exports.register = (req,res,next) => {
    res.render('users/register')
}

module.exports.doRegister = (req, res, next) => {
    res.send(req.body)
}