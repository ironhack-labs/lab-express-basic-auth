document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);


Handlebars.registerHelper('splitEmail', function (email) {
  let user = email.split("@");
  return user[2];
})