const bcrypt = require('bcryptjs');

const salt = "random_salt_string_123";
const password = "admin123";
const combinedString = salt + password;

const passwordHash = bcrypt.hashSync(combinedString, 10);

console.log("Salt:", salt);
console.log("Password:", password);
console.log("Combined String:", combinedString);
console.log("Generated Hash:", passwordHash);