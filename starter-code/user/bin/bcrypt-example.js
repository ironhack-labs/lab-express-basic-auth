const bcrypt = require("bcrypt");

// ENCRYPTING A PASSWORD--------------------------------------------
//------------------------------------------------------------------
// STEP #1) generate a salt
const saltA = bcrypt.genSaltSync(10);

// 2) excrypting the password(a.k.a "hashing" the password)
const scrambledPassA = bcrypt.hashSync("swordfish", saltA);


console.log("Password A (swordfish)");
console.log(`salt:              ${saltA}`);
console.log(`encrpted password: ${scrambledPassA}`);

//  VERYFYING A PASSWORD------------------------------------------
//----------------------------------------------------------------
console.log("Compare with swordfish (should be true)");
console.log(bcrypt.compareSync("swordfish", scrambledPassA));

console.log("Compare with swordfish (should be false)");
console.log(bcrypt.compareSync("blah", scrambledPassA));
