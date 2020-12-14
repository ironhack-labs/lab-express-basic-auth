// User model here

const {Schema,model}=require("mongoose")

const emailRegex = /^\S+@\S+\.\S+$/

const UserSchema = new Schema({
    email :{
        type:String,
        trim: true,
        required: true,
        unique: true,
        match: [emailRegex, "Please use a valid email adress"]
    },
    hashPassword:{
        type:String,
        required:true,
        trim:true
    },
    //timestamps:true,
})

module.exports = model("User",UserSchema);
