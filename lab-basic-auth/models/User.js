const mongoose = require("mongoose");
const Schema = mongoose.Schema;

 const userSchema = new Schema({
  user: String,
  password: String
 },
 {timestamps: {
   createdAt: "created_at",
   updatedAt: "updated_at"

 }
});
const User = mongoose.model("User", userSchema);
module.exports = User;