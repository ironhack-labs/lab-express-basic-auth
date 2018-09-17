const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const registerSchema = new Schema({
  username: {type: String, unique: true},
  password: String
 
  
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;
