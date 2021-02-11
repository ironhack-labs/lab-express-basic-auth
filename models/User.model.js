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
            unique : true,
            trim : true,
            required : [true , "password is required"],
            lowercase: true
        },
        
    },
    {
        timestamps:true
    }
)

const User = model("users",UserSchema)
module.exports = User