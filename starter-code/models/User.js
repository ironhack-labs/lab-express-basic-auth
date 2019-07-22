const mongoose = require('mongoose');
const {Schema} = mongoose;


const userSchema = new Schema({
      username: {
        type: String, 
        unique: true
      },
      password: String
},{
  timestamps: true,
  versionKey: false

})



module.exports = mongoose.model('User', userSchema)

