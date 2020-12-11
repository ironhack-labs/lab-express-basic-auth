// User model here

const {Schema,model}=require("mongoose")

const UserSchema = new Schema({
    email:String,
    hashPassword:String,
})

module.exports = model("User",UserSchema);
