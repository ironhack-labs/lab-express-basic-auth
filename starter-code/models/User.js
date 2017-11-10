const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema ({
  username: {type: String, required: [true]},
  password: {type: String, required: [true]}
  },
  {
    timestamps: {
      createdAt: "create_at",
      updateAt: "update_at"
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
