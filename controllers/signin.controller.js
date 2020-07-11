const User = require('../models/User.model.js')
const mongoose = require('mongoose')

exports.indexRender = (req, res, next) => { res.render('index')}
exports.signinRender = (req, res, next) => { res.render('createUser'), { user: new User()}}
exports.createUser = (req, res, next) => {
  const user = new User(req.body)
  user.save()
    .then(() => res.redirect('/sucessfull'))
    .catch(err => {
        res.render('/createUser', { error: err.errors, user})
    })
}
exports.createSuccesfull = (req, res, next) => {res.render('sucessfull')}