const mongoose = require('mongoose');
const Book = require('../models/Book.model');

module.exports.create = (req, res, next) => {
  res.render('book/form')
}

module.exports.doCreate = (req, res, next) => {
  const renderWithErrors = errors => {
    res.render(
      'book/form',
      {
        book: req.body,
        errors
      }
    )
  }

  const newBook = {
    title: req.body.title,
    description: req.body.description,
    user: req.currentUser.id
  }

  Book.create(newBook)
    .then(book => {
      res.redirect('/profile')
    })
    .catch(err => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors)
      } else {
        next(err)
      }
    })
}