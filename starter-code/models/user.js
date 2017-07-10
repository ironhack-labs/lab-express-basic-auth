const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
  username: String,
  password: String
}, {
  timestamps: {
    createAt: "created_at",
    updateAt: "updated_at"
  }
})


const User = mongoose.model('User', userSchema);
module.exports = User;
