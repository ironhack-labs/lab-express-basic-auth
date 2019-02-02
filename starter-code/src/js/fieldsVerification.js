const userSchema = require("../../models/user")

const checkFields = user => {
    const result = userSchema.findOne({ "username": user })
    return result !== null ? true : false
}

module.exports = checkFields