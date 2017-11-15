

const mongoose= require('mongoose');


mongoose.connect('mongodb://localhost/users-auth',{useMongoClient: true})
.then(()=>{
  console.log('mongoose connected!');
})
.catch((err)=>{

  console.log(err);
  console.log("error");
});
