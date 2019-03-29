const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema (
    {
    username: {
        type: String,
        require: true,
        unique: true
        
    },
    password: {
        type: String,
        trim: true,
        required: true,
        }
    },
);

module.exports = mongoose.model("User", userSchema)