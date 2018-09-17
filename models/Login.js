const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loginSchema = new Schema({
  user: { type: String, required: true, unique: true },
  password: { type: String, required: true }
},
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  
});

const Login = mongoose.model("loginSchema", loginSchema);

module.exports = Login;
