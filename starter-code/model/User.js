const {model, Schema} = require ("mongoose")

new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = model('User', userSchema)