const userSchema = require("../../models/user")

const checkUser = username => {
    //todo
return userSchema.findOne({ "username": username })
    .then(user => {
        return user !== null ? true : false
    })
}

const checkFields = (username, password) => {
    return (username === "" || password === "") ? true : false
}

module.exports = {
    checkFields,
    checkUser
}