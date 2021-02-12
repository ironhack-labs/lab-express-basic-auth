const mongoose = require("mongoose")
const {Schema , model} = mongoose


const UserSchema = new Schema (
    {
        username:{
            type: String,
            unique : true,
            trim : true,
            required : [true , "username is required"],
        },
        passwordHash: {
            type: String,
            required : [true , "password is required"],
        },
    },
    {
        timestamps:true
    }
)

const User = model("users",UserSchema)
module.exports = User