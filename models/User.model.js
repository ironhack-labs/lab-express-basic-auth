// User model here
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        userName : {type : String, required:[true, "Username is required."], unique: true},
        passwordHash: { type: String, required: [true, "Password is required."] },
    },
    {
        timestamps : true
    }
);

const User = mongoose.model("User",userSchema);
module.exports = User;