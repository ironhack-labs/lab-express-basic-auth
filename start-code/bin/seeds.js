const mongoose = require('mongoose');
const User = require('../models/user');
const dbName = 'lab-express-users';



mongoose.connect(`mongodb://localhost/${dbName}`);

 const users = [
   {
     username: 'pepe',
     encriptedPassword: 'pepe123'
   },
   {
    username: 'pepa',
    encriptedPassword: 'pepa123'
  }
];

User.collection.drop()
// .then(() => {
//    console.log(' DB clear');
//  })
 User.create(users)
	.then(() => {
		console.log(`Created ${users.length} celebrity`);
		mongoose.connection.close();
	})
	.catch((e)=>{
		console.log('Error on creating the database');
		throw (e);
	});
	