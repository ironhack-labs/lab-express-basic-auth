module.exports.register = (req, res, next) => {
    res.render('users/register')
}

module.exports.doRegister = (req, res, next) => {
    function renderWithErrors(errors) {
        res.status(400).render('users/register', {
            errors: errors,
            user: req.body
        })

        user.findOne({ email: req.body.mail })
            .then((user) => {
                if (user) {
                    renderWithErrors({
                        email: 'Este mail ya ha sido registrado'
                    })
                } else {
                    User.create(req.body)
                        .then(() => {
                            res.redirect('/')
                        })
                        .catch(e => {
                            if (e instanceof mongoose.Error.ValidationError) {
                                renderWithError(e.errors)
                            } else {
                                next(e)
                            }
                        })
                }
            })
            .catch(e => next(e))
    }
}