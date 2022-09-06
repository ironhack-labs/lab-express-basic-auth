const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: { type: String, unique: true, trim: true, required: [true, 'Es necesario el username.'] },
  password: { type: String, required:[true, 'Es necesario la contraseña.'], trim: true }
});

const user = model("user", userSchema);

module.exports = user;
