const hbs = require('hbs');

module.exports = app => {
        hbs.registerHelper('splitEmail', function (email) {
            console.log("email first: " + email)
            let user = email.split("@");
            console.log(user)
            return user[0];
        })
}

