//importacion 

const { timeStamp } = require("console")
const mongoose = require("mongoose")


//schema

const userSchema = mongoose.Schema({

    username: {
        type: String,
        trim: true,
        required: true
    },

    password: {
        type: String,
        required: true,
    }, 

    newsletter: {
        type: String,
        required: false,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Por favor utiliza un email válido."]
    }


}, {timeStamp:true})


//modelo

const User = mongoose.model("User", userSchema)


//exportacion
module.exports= User