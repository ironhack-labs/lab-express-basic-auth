const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema ({

    firstName : {type: String, default: undefined},

    lastName: {type: String, default: undefined},
    
    email: String, 

    password: String, 

  } , {

  timestamps: true

})


const User = mongoose.model("user", userSchema)

module.exports = User