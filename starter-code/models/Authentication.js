const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authSchema = new Schema({
  username: { 
    type: String,
    unique: true
  },
  password: String
}, {
    timestamps: true
});

const AuthSchema = mongoose.model("AuthSchema", authSchema);

module.exports = AuthSchema;