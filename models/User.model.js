const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new mongoose.Schema(
  {
  username: {
    type: String,
    required: [true, "Username required"],
    unique:[true, "Username already in use"]
  },
  password: {
   type: String,
  required: [true, 'Password required'],
  minlenght: [8, 'Your password must have at least 8 characters']
  }
});



userSchema.pre("save", function(next){
  const rowPassword = this.password;
  if(this.isModified("password")){
    bcrypt.hash(rowPassword, SALT_ROUNDS)
    .then(hash =>{
      this.password = hash;
      next()
    })
    .catch(err => console.log(err))
  }
})

userSchema.methods.checkPassword = function(passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;

// email:{
//   type: String,
//   match: EMAIL_PATTERN,
//   required : [true, "Email required"],
//   unique: [true, 'Email already in use'],
// },
// const EMAIL_PATTERN =
//   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;10;