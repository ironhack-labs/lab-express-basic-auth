//Importaciones

const mongoose = require("mongoose")



//schema

const userSchema = mongoose.Schema({

    username: {
        type:       String,
        required:   true,
        trim:       true,
        unique:     true
    },

    password: {
        type:       String,
        required:   true
    }

}, {timestamps: true })


//modelo

const User= mongoose.model("User", userSchema)

//exportacion

module.exports= User