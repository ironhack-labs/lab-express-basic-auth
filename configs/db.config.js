require("dotenv").config();
const mongoose = require('mongoose');

const dbOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDb = async () =>{
  try{
  const self = await mongoose.connect(process.env.MONGO_URL, dbOptions);
  await self.connection.dropDatabase();
  console.log("connected to DB and eliminated previous data in DB");
  
  
  }catch(err){
    console.error(err);
  }


}

module.exports = connectDb;
