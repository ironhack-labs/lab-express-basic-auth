// User model here
const { Schema, model} = require("mongoose")

const userLogIn = new Schema(
    {
    username: {
        type: String,
        trim: true,
        required: [true, "Username is required homie!"],
        unique: true
    },
    email: {
        password: {
            type: String,
            required: [true, "Password is required my friend!"]
        }
    }
},
{
    timestamps: true,
}
)

module.exports = model("User", userLogIn)
