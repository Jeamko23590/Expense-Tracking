const bcrypt = require('bcryptjs');

/**
 * Script to generate hashed password
 * Run: node scripts/hashPassword.js
 */
const password = 'Password123';

bcrypt.hash(password, 10).then(hash => {
  console.log('Password:', password);
  console.log('Hashed:', hash);
});
