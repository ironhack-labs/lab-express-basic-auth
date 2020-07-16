const mongoose = require('mongoose');
const User = require('../models/User.model');
const faker = require('faker');
require('../configs/db.config');

const users = [];

for(let i = 0; i < 5; i++) {
    const randUser = {
        name: faker.name.findName(),
        password: faker.internet.password
    }
    users.push(randUser);
}

User.deleteMany({})
    .then(() => User.create(users))
    .then(() => {
        console.log('Database seeded');
        mongoose.connection.close();
    })
    .catch(e => console.error(e));