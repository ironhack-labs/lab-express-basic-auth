

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new mongoose.Schema(
  {
  username: {
    type: String,
    unique: true
  },
  password: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;