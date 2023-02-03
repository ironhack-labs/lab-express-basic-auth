const Book = require('../models/Book.model')

module.exports.profile = (req, res, next) => {
  Book.find({ user: { $ne: req.currentUser.id } })
    .populate('user')
    .then(books => {
      res.render('user/profile', { books })
    })
    // .catch(err => next(err))
    .catch(next)
}