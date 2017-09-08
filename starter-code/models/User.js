const mongoose = require("mongoose")
const Schema = mongoose.Schema


const userSchema = new Schema ({
  name: String,
  password: String
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

module.export = mongoose.model("User", userSchema);
