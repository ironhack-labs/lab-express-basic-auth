const mongoose = require('mongoose');
const User = require('../models/user');

const dbName = 'Basic-Auth';

mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true } );

const dbtitle = 'Basic-Auth';

mongoose.connect(`mongodb://localhost/${dbtitle}`, { useNewUrlParser: true, useUnifiedTopology: true });


const users = [{
    name: 'Unai',
    lastName: 'Gonzalez',
    password: 'gomagoma4'
}
]

User.create(users, (err) => {
    if (err) { throw(err) }
    console.log(`Created ${users.length} movies`)
    mongoose.connection.close();
  });


