const userSchema=require('../schemas/user.js');

module.exports=(conn)=>{
  return(conn?conn:require('mongoose')).model('user',userSchema);
}