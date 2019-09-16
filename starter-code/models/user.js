const { Schema, model } = require('mongoose')
const PLM = require('passport-local-mongoose')

const userSchema = new Schema({
  username: String,
  password: String
}, {
    timestamps: true,
    versionKey: false
  });

userSchema.plugin(PLM, { usernameField: 'username' })
module.exports = model('User', userSchema)