const {model, Schema} = require ("mongoose")

const userSchema = new Schema (
{
  username: String,
  password: String
},{
  timestamps: true,
  versionkey: false
}
)

module.exports = model("User", userSchema)