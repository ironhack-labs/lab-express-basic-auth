const mongoose = require("mongoose");
const Schema = moongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: [true, "Provide a name"]
  },
  password: {
    type: String,
    required: [true, "Provide a password"]
  }
});

module.export = mongoose.model("User", userSchema);
