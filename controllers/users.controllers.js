const User = require("../models/User.model");


module.exports.list = ((req, res, next) => {
    User.find()
        .then((users) => res.render("list", { users }))
        .catch(e => console.error(e))
})

module.exports.create = ((req, res, next) => {
    res.render("create")
})

module.exports.doCreate = ((req, res, next) => {
    User.create(req.body)
        .then(() => {
            console.log(req.body)
            res.redirect("/list")
        })
})

module.exports.index = ((req, res, next) => {
    res.render("index")
})