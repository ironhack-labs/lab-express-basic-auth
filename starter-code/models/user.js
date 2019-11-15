const {Schema, model} = require("mongoose")

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
})

module.exports = model("User", userSchema)