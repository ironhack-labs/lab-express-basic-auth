const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const druglordSchema = new Schema(
  {
    userName: { type: String, unique: true, required: true, minlength: 2 },
    encryptedPassword: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

const Druglord = mongoose.model("Druglord", druglordSchema);

module.exports = Druglord;
