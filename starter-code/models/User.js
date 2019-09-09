const {Schema, model} = require('mongoose')

const userSchema = new Schema({

  username: {
    required: true,
    type: String,
    unique: true,
    
  },
  password: {
    type: String,
    required: true
  },
},
  {
    timestamps: true,
    versionKey: false
  }

)

module.exports = model('User', userSchema)