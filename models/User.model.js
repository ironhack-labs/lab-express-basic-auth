// User model here
const {Schema , model} = require("mongoose")

const userSchema =  new Schema({

    username:{
        type: String,
        require: true,
    },
    password:{
        type: String,
        require:true
    }

})

module.exports= model("User",userSchema)