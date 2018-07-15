const mongoose = require('mongoose');
const DB_NAME = 'ex-basic-auth';
const MONGO_URI = `mongodb://localhost:27017/${DB_NAME}`;

mongoose.connect(MONGO_URI, { useNewUrlParser: true })
.then(()=>{
    console.log(`connected to ${MONGO_URI}`);
})
.catch(error =>{
    console.log('cannot connect', error);
});
