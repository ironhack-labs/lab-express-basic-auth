const bcrypt = require('bcrypt')

const myPlaintextPassword = 'holaAmijos'
const  encryptedPassword = '$2b$10$YittpSqzKVMf7DQP6CHAM.Kh1ogoLNAFloQHj2.uAOJzMbdP33/UW'
const saltRounds = 10

bcrypt.hash(myPlaintextPassword, saltRounds)
    .then(function(hash) {
        console.log(hash)
    });

bcrypt.compare(myPlaintextPassword, encryptedPassword)
    .then(function(result) {
        if (result) {
            console.log('good!')
        } else {
            console.log('fail!')
        }
    })