const mongoose = require('mongoose');
const Student = require('../models/quote');
var faker = require('faker');
mongoose.connect('mongodb://127.0.0.1:27017/iron-dixit');

const randomCourse = () => {
  let rand = '';
  const course = [ 'WebDev', 'UX/UI' ];
  const month = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dex' ];
  const year = [ '2012', '2013', '2014', '2015', '2016', '2017' ];
  const city = [ 'PAR', 'BCN', 'AMS', 'BER', 'MEX', 'MAD' ];
  rand += course[Math.floor(Math.random() * course.length)] + ' ';
  rand += month[Math.floor(Math.random() * month.length)] + ' ';
  rand += year[Math.floor(Math.random() * year.length)] + ' ';
  rand += city[Math.floor(Math.random() * city.length)] + ' ';
  return rand;
};

const students = [];

for (let i = 0; i < 20; i++) {
  students.push({
    name: faker.name.findName(),
    occupation: randomCourse(),
    catchPhrase: faker.lorem.sentence(),
    photo: faker.image.avatar()
  });
};

Student.create(students, (err) => {
  if (err) { throw (err); }
  console.log(`Created ${students.length} Students`);
  mongoose.connection.close();
});
