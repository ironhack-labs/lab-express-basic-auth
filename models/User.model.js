const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Es necesario el username.'],
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Se necesita añadir una contraseña'],
    trim: true
  }
},
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
    versionKey: false
  }
);

const userModel = model("User", userSchema);

module.exports = userModel;
