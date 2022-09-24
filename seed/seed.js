const mongoose = require('mongoose');
const fetch = require('node-fetch');
const bcryptjs = require('bcryptjs');
const saltRounds = 12;

const User = require('../models/User.model');
require('../db');

// Getting random users
async function randomUserToDataBase() {
  const randomUser = await fetch('https://randomuser.me/api/?results=10&password=upper,lower,number,8-16&inc=login&noinfo');
  const randomUserJson = await randomUser.json();
  console.log(randomUserJson);
  try {
    for (entry of randomUserJson.results) {
      const {
        login: { username, password },
      } = entry;
      const isUser = await User.findOne({ username: username });
      if (isUser) {
        console.log(`User ${username} already there!`);
      } else {
        const salt = await bcryptjs.genSalt(saltRounds);
        const hashedPassword = await bcryptjs.hash(password, salt);
        await User.create({ username, passwordHash: hashedPassword });
      }
    }
    mongoose.connection.close();
  } catch (error) {
    console.log(error);
  }
}

randomUserToDataBase();
