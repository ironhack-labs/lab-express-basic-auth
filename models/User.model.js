// User model here
const {Schema, model} = require("mongoose"); 

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    }, 
    password : String
}); 

const User = model("User", userSchema); //

model.exports = User; 