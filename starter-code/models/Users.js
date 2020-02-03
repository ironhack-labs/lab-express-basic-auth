const {Schema, models} = require("mongoose")

const userSchema = new Schema (
    {
        name: String,
        email: String,
        password: String
    }, 
    {
        timestamps: true,
        versionkey: false
    }
)

module.exports = model("User", userSchema)