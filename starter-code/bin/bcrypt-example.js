const bcrypt = require ("bcrypt");

//NCRYPT password beforesaving them
//1,SingUp feature
//2.Seed for creating users
//3.Update password feature
//
const encryptedFox=bcrypt.hashSync("fox",10);
console.log(encryptedFox);



const encryptedEmpty = bcrypt.hashSync("",10);
console.log(encryptedEmpty);

//bcrypt.hash();
//COMPARE password with compare ()'or comparesync()
//1 login
//bcrypt.compare();
console.log(bcrypt.compareSync("fox",encryptedFox));
console.log(bcrypt.compareSync("Fox",encryptedFox));